import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// APIs
import { AuthModule } from './apis/auth/auth.module';

// Configs
import { PostgresModule } from './configs/postgres.module';
import { PostModule } from './apis/post/post.module';
import { ScheduleModule } from './apis/schedule/schedule.module';
import { MediaModule } from './apis/media/media.module';
import { RequestModule } from './apis/request/request.module';
import { NotificationModule } from './apis/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    AuthModule,
    PostModule,
    ScheduleModule,
    MediaModule,
    RequestModule,
    NotificationModule,
  ],
})
export class AppModule {}
