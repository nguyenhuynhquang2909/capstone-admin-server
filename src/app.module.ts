import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ServerController } from './server/server.controller';
// import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
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
    DatabaseModule,
    // UserModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [ServerController],
  providers: [],
})
export class AppModule {}
