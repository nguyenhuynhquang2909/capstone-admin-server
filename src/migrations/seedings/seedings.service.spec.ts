import { Test, TestingModule } from '@nestjs/testing';
import { SeedingsService } from './seedings.service';

describe('SeedingsService', () => {
  let service: SeedingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedingsService],
    }).compile();

    service = module.get<SeedingsService>(SeedingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
