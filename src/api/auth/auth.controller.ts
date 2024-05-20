import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Res,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  async sendOtp(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ status: string; message: string }> {
    return await this.authService.sendOtp(createAuthDto);
  }

  @Post('verify')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.verifyOtp(
      verifyOtpDto,
    );
    this.setAuthorizationHeader(response, result.accessToken);
    delete result.accessToken;
    response.status(HttpStatus.OK).json(result);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Headers('authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<void> {
    this.checkAuthorizationHeader(authHeader);

    const accessToken = authHeader.split(' ')[1];
    const decodedToken = this.authService.decodeToken(accessToken);
    this.checkDecodedToken(decodedToken);

    const profile = await this.authService.getProfile(decodedToken.userId);
    this.checkUserProfile(profile);

    response.status(HttpStatus.OK).json({ status: 'success', data: profile });
  }

  private setAuthorizationHeader(
    response: Response,
    accessToken: string,
  ): void {
    response.setHeader('Authorization', `Bearer ${accessToken}`);
  }

  private clearAuthorizationHeader(response: Response): void {
    response.setHeader('Authorization', '');
  }

  private checkAuthorizationHeader(authHeader: string): void {
    if (!authHeader) {
      throw new UnauthorizedException('Không có Header ủy quyền được cung cấp');
    }
  }

  private checkDecodedToken(decodedToken: any): void {
    if (!decodedToken || !decodedToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  private checkUserProfile(profile: any): void {
    if (!profile) {
      throw new HttpException(
        'Người dùng không được tìm thấy',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
