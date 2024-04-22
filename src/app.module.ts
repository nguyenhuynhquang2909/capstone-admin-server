import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ServerController } from './server/server.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [ServerController],
  providers: [],
})
export class AppModule {}
