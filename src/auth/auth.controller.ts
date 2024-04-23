import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
  Headers,
  Get,
  UnauthorizedException,
  // Get,
  // Headers,
  // UnauthorizedException,
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
    return this.authService.sendOtp(createAuthDto).catch((error) => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{
    status: string;
    message: string;
    accessToken?: string;
    expiresIn?: string;
  }> {
    return this.authService.verifyOtp(verifyOtpDto).catch((error) => {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Post('logout')
  async logout(@Res() response: Response): Promise<void> {
    // Set the JWT token in the cookie to expire immediately
    response
      .cookie('jwt', '', { httpOnly: true, maxAge: 0 })
      .json({ message: 'Successfully logged out' })
      .status(HttpStatus.OK);
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
  // @Get('profile')
  // @UseGuards(AuthGuard())
  // async getProfile(
  //   @Headers('authorization') authHeader: string,
  // ): Promise<{ status: string; data?: any }> {
  //   const accessToken = authHeader.split(' ')[1];
  //   const decodedToken = this.authService.jwtService.decode(accessToken) as {
  //     userId: number;
  //   };

  //   if (!decodedToken || !decodedToken.userId) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }

  //   return this.authService.getProfile(decodedToken.userId);
  // }

  // @Post('logout')
  // @UseGuards(AuthGuard())
  // async logout(
  //   @Headers('authorization') authHeader: string,
  // ): Promise<{ status: string; message: string }> {
  //   const accessToken = authHeader.split(' ')[1];
  //   const decodedToken = this.authService.jwtService.decode(accessToken) as {
  //     userId: number;
  //   };

  //   if (!decodedToken || !decodedToken.userId) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }

  //   return this.authService.logout(decodedToken.userId);
  // }
}
