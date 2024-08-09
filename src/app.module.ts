import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// APIs
import { AuthModule } from './apis/auth/auth.module';
import { PostModule } from './apis/post/post.module';
import { MediaModule } from './apis/media/media.module';

// Configs
import { PostgresModule } from './configs/postgres.module';
import { DailyScheduleModule } from './apis/daily-schedule/daily-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    AuthModule,
    PostModule,
    MediaModule,
    DailyScheduleModule,
  ],
})
export class AppModule {}
