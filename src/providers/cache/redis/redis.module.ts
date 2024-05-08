import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CacheModuleOptions => ({
        isGlobal: true,
        store: redisStore,
        host: configService.getOrThrow('REDIS_HOST'),
        port: 6379,
        username: configService.getOrThrow('REDIS_USERNAME'),
        // password: configService.getOrThrow('REDIS_PASSWORD'),
        no_ready_check: true,
      }),
    }),
  ],
})
export class RedisModule {}
