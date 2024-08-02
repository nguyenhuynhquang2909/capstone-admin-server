import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';

// Configs
import { RedisModule } from '../../configs/redis.module';

// Entities
import { User } from '../../common/entities/user.entity';
import { Student } from '../../common/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student]), RedisModule],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
})
export class AuthModule {}
