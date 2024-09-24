import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// DTOs
import { LoginDto } from './dto/login.dto';

// Enttities
import { User } from '../../common/entities/user.entity';
import { NotFound } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      message: 'Login successful',
      token: token,
    };
  }

  async getUserDetails(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {id: userId},
      relations: ['role']
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
      role_name: user.role.name,
      is_active: user.is_active,
      last_login: user.last_login
    }
  }
}
