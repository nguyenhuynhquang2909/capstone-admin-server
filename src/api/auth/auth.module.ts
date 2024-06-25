import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { UserSession } from '../../common/entities/user-session.entity';
import { DeviceToken } from '../../common/entities/device-token.entity';

import { JwtStrategy } from '../../common/guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession, Role, DeviceToken]),
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
