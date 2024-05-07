import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('POSTGRESQL_HOST'),
        port: +configService.getOrThrow('POSTGRESQL_PORT'),
        username: configService.getOrThrow('POSTGRESQL_USERNAME'),
        password: configService.getOrThrow('POSTGRESQL_PASSWORD'),
        database: configService.getOrThrow('POSTGRESQL_DATABASE'),
        autoLoadEntities: true,
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        // do NOT use synchronize: true in real projects
        synchronize: false,
      }),
    }),
  ],
})
export class PostgresModule {}
