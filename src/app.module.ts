import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './providers/database/postgres/postgres.module';
import { ServerController } from './api/server/server.controller';
import { UserModule } from './api/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './api/auth/auth.module';
import { RedisModule } from './providers/cache/redis/redis.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    PostgresModule,
    UserModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [ServerController],
  providers: [],
})
export class AppModule {}
