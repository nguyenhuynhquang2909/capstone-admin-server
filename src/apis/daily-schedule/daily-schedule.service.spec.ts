import { Test, TestingModule } from '@nestjs/testing';
import { DailyScheduleService } from './daily-schedule.service';

describe('DailyScheduleService', () => {
  let service: DailyScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyScheduleService],
    }).compile();

    service = module.get<DailyScheduleService>(DailyScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
