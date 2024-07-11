import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClassScheduleController } from './class_schedule.controller';
import { ClassScheduleService } from './class_schedule.service';
import { DailySchedule } from '../../common/entities/daily-schedule.entity';
import { AuthService } from '../auth/auth.service';

import { JwtStrategy } from '../../common/guards/jwt.strategy';

import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { UserSession } from '../../common/entities/user-session.entity';
import { DeviceToken } from '../../common/entities/device-token.entity';
import { Student } from '../../common/entities/student.entity';
import { ClassStudent } from '../../common/entities/class-student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailySchedule,
      User,
      Role,
      UserSession,
      DeviceToken,
      Student,
      ClassStudent,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService, JwtStrategy, AuthService],
})
export class ClassScheduleModule {}
