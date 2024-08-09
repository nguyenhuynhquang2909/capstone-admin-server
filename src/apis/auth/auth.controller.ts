import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

// DTO
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { message, token } = await this.authService.login(loginDto);

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.json({ message });
  }
}
