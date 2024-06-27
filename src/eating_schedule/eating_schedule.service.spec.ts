import { Test, TestingModule } from '@nestjs/testing';
import { EatingScheduleService } from './eating_schedule.service';

describe('EatingScheduleService', () => {
  let service: EatingScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EatingScheduleService],
    }).compile();

    service = module.get<EatingScheduleService>(EatingScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
