import {
  Injectable,
  BadRequestException,
  // UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { User } from '../user/entities/user.entity';
// import { UserSession } from './entities/user-session.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @InjectRepository(UserSession)
    // private readonly userSessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly cacheService: Cache,
  ) {}

  async sendOtp(
    createAuthDto: CreateAuthDto,
  ): Promise<{ status: string; message: string }> {
    if (!createAuthDto.phone) {
      throw new BadRequestException('Phone number is required');
    }

    const user = await this.userRepository.findOne({
      where: { phone: createAuthDto.phone },
    });

    if (!user) {
      throw new BadRequestException('Invalid phone number');
    }

    const otp = randomInt(100000, 999999).toString();

    await this.cacheService.set(createAuthDto.phone, otp);

    console.log(`OTP for ${createAuthDto.phone}: ${otp}`);

    return { status: 'success', message: `OTP code: ${otp}` };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    status: string;
    message: string;
    accessToken?: string;
    expiresIn?: string;
  }> {
    if (!verifyOtpDto.phone) {
      throw new BadRequestException('Phone number is required');
    }

    if (!verifyOtpDto.otp) {
      throw new BadRequestException('OTP code is required');
    }

    const user = await this.userRepository.findOne({
      where: { phone: verifyOtpDto.phone },
    });

    if (!user) {
      throw new BadRequestException('Invalid phone number');
    }

    const storedOtp = await this.cacheService.get<string>(verifyOtpDto.phone);

    if (storedOtp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const accessToken = this.jwtService.sign({ userId: user.id });
    const expiresIn = '13608000';

    return {
      status: 'success',
      message: 'OTP is valid',
      accessToken,
      expiresIn,
    };
  }
  public decodeToken(token: string): { userId: number } | null {
    try {
      return this.jwtService.decode(token) as { userId: number };
    } catch (error) {
      return null;
    }
  }

  // async getProfile(userId: number): Promise<{ status: string; data?: any }> {
  //   const user = await this.userRepository.findOne({ id: userId });
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }

  //   return {
  //     status: 'success',
  //     data: {
  //       userId: user.id,
  //       phone: user.phone,
  //       permissions: ['read', 'write'],
  //     },
  //   };
  // }

  // async logout(userId: number): Promise<{ status: string; message: string }> {
  //   const userSession = await this.userSessionRepository.findOne({
  //     user: { id: userId },
  //   });
  //   if (!userSession) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }

  //   // Invalidate the access token (optional)
  //   // Remove the session from the database (optional)

  //   return { status: 'success', message: 'User logged out successfully' };
  // }
}
