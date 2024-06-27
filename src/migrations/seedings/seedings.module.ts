import { Module } from '@nestjs/common';
import { SeedingsService } from './seedings.service';
import { SeedingsController } from './seedings.controller';

@Module({
  controllers: [SeedingsController],
  providers: [SeedingsService],
})
export class SeedingsModule {}
