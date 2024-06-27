import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

// Config env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('LOCALHOST_PORT');
  console.log('PORT', PORT);
  // Set global prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  // Config cors
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);

  // await app.listen(3200);
  // const logger = new Logger('Bootstrap');
  // logger.log(`Server is running on: http://localhost:3100`);
}
bootstrap();
