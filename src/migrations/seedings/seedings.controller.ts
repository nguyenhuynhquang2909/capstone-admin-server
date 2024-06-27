import { Controller, Post } from '@nestjs/common';
import { SeedingsService } from './seedings.service';

@Controller('seeding')
export class SeedingsController {
  constructor(private readonly seedingService: SeedingsService) {}

  @Post()
  seed() {
    return this.seedingService.seed();
  }
}
