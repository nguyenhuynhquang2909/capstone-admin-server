import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../common/guards/jwt.strategy';
import { AuthService } from '../auth/auth.service';

import { StudentImage } from '../../common/entities/student-image.entity';
import { Student } from '../../common/entities/student.entity';
import { MainImage } from '../../common/entities/main-image.entity';
import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { UserSession } from '../../common/entities/user-session.entity';
import { DeviceToken } from '../../common/entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentImage, MainImage, User, Role, UserSession, DeviceToken, Student]),
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
  controllers: [ImageController],
  providers: [ImageService, JwtStrategy, AuthService],
})
export class ImageModule {}
