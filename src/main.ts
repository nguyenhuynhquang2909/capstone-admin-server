import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);

  const logger = new Logger('Bootstrap');
  logger.log(`Server is running on: http://localhost:3000`);
}
bootstrap();
