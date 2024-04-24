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
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async sendOtp(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ status: string; message: string }> {
    try {
      return await this.authService.sendOtp(createAuthDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto);
      response.setHeader('Authorization', `Bearer ${result.accessToken}`);
      response.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('logout')
  async logout(
    @Headers('authorization') authHeader: string,
    @Res() response: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.logout(authHeader);
      response.setHeader('Authorization', '');
      response.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Headers('authorization') authHeader: string,
  ): Promise<{ status: string; data?: any }> {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    const accessToken = authHeader.split(' ')[1];
    const decodedToken = this.authService.decodeToken(accessToken);
    if (!decodedToken || !decodedToken.userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const profile = await this.authService.getProfile(decodedToken.userId);
    if (!profile) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', data: profile };
  }
}
