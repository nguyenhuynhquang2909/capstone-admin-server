import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';

// DTO
import { LoginDto } from './dto/login.dto';

// Enttities
import { User } from '../../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtGuard: JwtGuard,
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

    const token = this.jwtGuard.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      message: 'Login successful',
      token,
    };
  }
}
