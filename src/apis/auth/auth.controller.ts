import { Controller, Post, Body, Res, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

// DTOs
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { JwtService } from 'src/common/jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { message, token } = await this.authService.login(loginDto);

    res.setHeader('Authorization', `Bearer ${token}`);
    return res.json({ message, token });
  }

  @Get('profile')
  @Role('schoolAdmin')
  async getUserDetails(
    @Headers('authorization') authHeader: string
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.authService.getUserDetails(userId);
  }
}
