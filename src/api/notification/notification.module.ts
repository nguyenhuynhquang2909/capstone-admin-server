import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FcmModule } from '../../providers/fcm/fcm.module';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DeviceToken } from '../../common/entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken]), FcmModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
