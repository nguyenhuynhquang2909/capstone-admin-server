import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// APIs
import { AuthModule } from './apis/auth/auth.module';

// Configs
import { PostgresModule } from './configs/postgres.module';
import { PostModule } from './apis/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostgresModule,
    AuthModule,
    PostModule,
  ],
})
export class AppModule {}
