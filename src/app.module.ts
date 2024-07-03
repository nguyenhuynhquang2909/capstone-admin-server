import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { PostgresModule } from './providers/database/postgres/postgres.module';
import { RedisModule } from './providers/cache/redis/redis.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { PostModule } from './api/post/post.module';
import { NotificationModule } from './api/notification/notification.module';
// import { SeedingsModule } from './migrations/seedings/seedings.module';
import { ClassScheduleModule } from './api/class_schedule/class_schedule.module';
import { EatingScheduleModule } from './api/eating_schedule/eating_schedule.module';
import { AbsenceModule } from './api/absence/absence.module';
import { AbsenceService } from './api/absence/absence.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_PASSWORD
    }),
    PostgresModule,
    UserModule,
    AuthModule,
    RedisModule,
    PostModule,
    NotificationModule,
    // SeedingsModule,
    ClassScheduleModule,
    EatingScheduleModule,
    AbsenceModule,
  ],
  controllers: [],
})
export class AppModule {}
