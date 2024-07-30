import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Notification } from '../../common/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationService, JwtService],
})
export class NotificationModule {}
