import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { JwtService } from '../../common/jwt/jwt.service';
import { AuthService } from './auth.service';

// DTO
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';

// Entities
import { User } from '../../common/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto, @Res() res: Response) {
    const user = await this.authService.verify(verifyDto);
    const token = this.jwtService.generateToken({
      userId: user.id,
      phone: user.phone,
    });

    res.setHeader('Authorization', `Bearer ${token}`);

    return res.json({
      message: 'Verification successful',
    });
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.userId },
      relations: ['students'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
