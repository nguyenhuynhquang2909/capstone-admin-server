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
    const result = await this.authService.verifyOtp(verifyOtpDto);
    response.setHeader('Authorization', `Bearer ${result.accessToken}`);
    response.status(HttpStatus.OK).json(result);
  }

  @Post('logout')
  async logout(
    @Headers('authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.logout(authHeader);
    response.setHeader('Authorization', '');
    response.status(HttpStatus.OK).json(result);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Headers('authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<void> {
    if (!authHeader) {
      throw new UnauthorizedException('Không có Header ủy quyền được cung cấp');
    }

    const accessToken = authHeader.split(' ')[1];
    const decodedToken = this.authService.decodeToken(accessToken);
    if (!decodedToken || !decodedToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    const profile = await this.authService.getProfile(decodedToken.userId);
    if (!profile) {
      throw new HttpException(
        'Người dùng không được tìm thấy',
        HttpStatus.NOT_FOUND,
      );
    }

    response.status(HttpStatus.OK).json({ status: 'success', data: profile });
  }
}
