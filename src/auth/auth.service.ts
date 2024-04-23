import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { randomInt } from 'crypto';
import { User } from '../user/entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession) private readonly userSessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly cacheService: Cache,
  ) {}

  async sendOtp(createAuthDto: CreateAuthDto): Promise<{ status: string; message: string }> {
    const { phone } = createAuthDto;
    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('Invalid phone number');
    }

    const otp = randomInt(100000, 999999).toString();
    await this.cacheService.set(phone, otp);

    return { status: 'success', message: `OTP code: ${otp}` };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    status: string;
    message: string;
    accessToken?: string;
    expiresIn?: string;
  }> {
    const { phone, otp } = verifyOtpDto;
    if (!phone || !otp) {
      throw new BadRequestException('Phone number and OTP code are required');
    }

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('Invalid phone number');
    }

    const storedOtp = await this.cacheService.get<string>(phone);
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.cacheService.del(phone);

    const accessToken = this.jwtService.sign({ userId: user.id });
    const expiresIn = '13608000'; // 4 months

    const userSession = new UserSession();
    userSession.accessToken = accessToken;
    userSession.user = user;
    userSession.accessTokenExpirationTime = new Date(Date.now() + parseInt(expiresIn) * 1000);

    await this.userSessionRepository.save(userSession);

    return {
      status: 'success',
      message: 'OTP is valid',
      accessToken,
      expiresIn,
    };
  }

  async logout(authHeader: string): Promise<{ status: string; message: string }> {
    const accessToken = authHeader?.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken) as {
      userId: number;
    };

    if (!decodedToken?.userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    return { status: 'success', message: 'User logged out successfully' };
  }
  
  async getProfile(userId: number): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { id: userId },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
  
  public decodeToken(token: string): { userId: number } | null {
    try {
      return this.jwtService.decode(token) as { userId: number };
    } catch (error) {
      return null;
    }
  }
}
