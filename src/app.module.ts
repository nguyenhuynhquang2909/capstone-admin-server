import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services and Modules
import { AuthModule } from './apis/auth/auth.module';
import { PostModule } from './apis/post/post.module';
import { MediaModule } from './apis/media/media.module';
// import { NeonDBModule } from './configs/neondb.module';
import { PostgresModule } from './configs/postgres.module';
import { DailyScheduleModule } from './apis/daily-schedule/daily-schedule.module';
import { ClassModule } from './apis/class/class.module';
import { FirebaseAdminService } from './common/services/firebase-admin.service';
import { PushNotificationService } from './common/services/push-notification.service';
import { DeviceToken } from './common/entities/device-token.entity';
import { EatingScheduleModule } from './apis/eating-schedule/eating-schedule.module';
import { StudentModule } from './apis/student/student.module';
import { UserModule } from './apis/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    AuthModule,
    PostModule,
    MediaModule,
    // NeonDBModule,
    DailyScheduleModule,
    ClassModule,
    TypeOrmModule.forFeature([DeviceToken]),
    EatingScheduleModule,
    StudentModule,
    UserModule,
  ],
  providers: [FirebaseAdminService, PushNotificationService],
})
export class AppModule {}
