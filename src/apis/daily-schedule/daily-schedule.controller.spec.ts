import { Test, TestingModule } from '@nestjs/testing';
import { DailyScheduleController } from './daily-schedule.controller';

describe('DailyScheduleController', () => {
  let controller: DailyScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyScheduleController],
    }).compile();

    controller = module.get<DailyScheduleController>(DailyScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
