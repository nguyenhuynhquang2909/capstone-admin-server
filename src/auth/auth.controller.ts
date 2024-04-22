import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  // Get,
  // Headers,
  // UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { AuthGuard } from '@nestjs/passport';

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
