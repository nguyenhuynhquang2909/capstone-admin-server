import {
  Injectable,
  BadRequestException,
  // UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { User } from '../user/entities/user.entity';
// import { UserSession } from './entities/user-session.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @InjectRepository(UserSession)
    // private readonly userSessionRepository: Repository<UserSession>,
    // private readonly jwtService: JwtService,
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
    // Here you can send the OTP via SMS or any other method
    console.log(`OTP for ${createAuthDto.phone}: ${otp}`);

    return { status: 'success', message: `OTP code: ${otp}` };
  }

  // async verifyOtp(
  //   verifyOtpDto: VerifyOtpDto,
  // ): Promise<{
  //   status: string;
  //   message: string;
  //   accessToken?: string;
  //   expiresIn?: string;
  // }> {
  //   const user = await this.userRepository.findOne({
  //     phone: verifyOtpDto.phone,
  //   });
  //   if (!user) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   // You can check if the OTP is valid here
  //   const isValidOtp = true; // Replace this with actual OTP validation
  //   if (!isValidOtp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   const accessToken = this.jwtService.sign({ userId: user.id });
  //   const expiresIn = '13608000';

  //   return {
  //     status: 'success',
  //     message: 'OTP is valid',
  //     accessToken,
  //     expiresIn,
  //   };
  // }

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
