import { Test, TestingModule } from '@nestjs/testing';
import { SeedingsController } from './seedings.controller';
import { SeedingsService } from './seedings.service';

describe('SeedingsController', () => {
  let controller: SeedingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedingsController],
      providers: [SeedingsService],
    }).compile();

    controller = module.get<SeedingsController>(SeedingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
