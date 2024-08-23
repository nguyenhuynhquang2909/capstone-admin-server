import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Student } from '../../common/entities/student.entity';
import { PushNotificationService } from '../../common/services/push-notification.service';
import { FirebaseAdminService } from '../../common/services/firebase-admin.service';
import { DeviceToken } from 'src/common/entities/device-token.entity';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RoleConfigService } from 'src/common/services/role-config.service';
import { JwtService } from '../../common/jwt/jwt.service';
import { Notification } from '../../common/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchoolAdmin, Student, DeviceToken, Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, PushNotificationService, FirebaseAdminService, RoleConfigService, JwtGuard, RoleGuard, JwtService],
})
export class NotificationModule {}
