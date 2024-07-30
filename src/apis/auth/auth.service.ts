import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Ioredis from 'ioredis';

// DTO
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';

// Entities
import { User } from '../../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Ioredis,
  ) {}

  async login(loginDto: LoginDto) {
    const { phone } = loginDto;
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = this.generateOtp();

    await this.redisClient.set(phone, otp, 'EX', 60);

    return {
      message: 'Login successful',
      otp,
    };
  }

  async verify(verifyDto: VerifyDto) {
    const { phone, otp } = verifyDto;

    const storedOtp = await this.redisClient.get(phone);

    if (!storedOtp) {
      throw new BadRequestException('OTP expired or invalid');
    }

    if (otp !== storedOtp) {
      await this.redisClient.del(phone);
      throw new BadRequestException('OTP does not match');
    }

    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
