import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { randomInt } from 'crypto';
import { User } from '../../common/entities/user.entity';
import { UserSession } from '../../common/entities/user-session.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Cache } from '@nestjs/cache-manager';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    private readonly jwtService: JwtService,
    private readonly cacheService: Cache,
  ) {}

  async sendOtp(
    createAuthDto: CreateAuthDto,
  ): Promise<{ status: string; message: string }> {
    const { phone } = createAuthDto;
    if (!phone) {
      throw new BadRequestException('Số điện thoại là bắt buộc');
    }

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException(
        'Số điện thoại không hợp lệ hoặc người dùng không tồn tại',
      );
    }

    // Generate OTP
    const otp = randomInt(100000, 999999).toString();

    // Set the OTP to last only 30 seconds
    await this.cacheService.set(phone, otp, 30);

    return { status: 'success', message: `OTP: ${otp}` };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    status: string;
    message: string;
    accessToken?: string;
  }> {
    const { phone, otp } = verifyOtpDto;
    if (!phone || !otp) {
      throw new BadRequestException('Số điện thoại và mã OTP là bắt buộc');
    }

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('Số điện thoại không hợp lệ');
    }

    const storedOtp = await this.cacheService.get<string>(phone);
    if (storedOtp !== otp) {
      // If the OTP is incorrect, remove the stored OTP
      await this.cacheService.del(phone);
      throw new BadRequestException('Mã OTP không hợp lệ');
    }

    await this.cacheService.del(phone);

    const accessTokenPayload = {
      userId: user.id,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + 4 * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 4 months
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);
    const expiresIn = 4 * 30 * 24 * 60 * 60; // 4 months

    const userSession = new UserSession();
    userSession.access_token = accessToken;
    userSession.user = user;
    userSession.access_token_expiration_time = new Date(
      Date.now() + expiresIn * 1000,
    );

    await this.userSessionRepository.save(userSession);

    return {
      status: 'success',
      message: 'Mã OTP hợp lệ',
      accessToken,
    };
  }

  async logout(
    authHeader: string,
  ): Promise<{ status: string; message: string }> {
    const accessToken = authHeader?.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken) as {
      userId: number;
    };

    if (!decodedToken?.userId) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }

    return { status: 'success', message: 'Người dùng đã đăng xuất thành công' };
  }

  async getProfile(userId: number): Promise<User | null> {
    const options: FindOneOptions<User> = {
      where: { id: userId },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new BadRequestException('Người dùng không được tìm thấy');
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

  async validateUser(payload: JwtPayload): Promise<any> {
    const options: FindOneOptions<User> = {
      where: { id: payload.userId },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new UnauthorizedException('Người dùng không được tìm thấy');
    }
    return user;
  }
}
