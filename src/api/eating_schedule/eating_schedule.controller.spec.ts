import { Test, TestingModule } from '@nestjs/testing';
import { EatingScheduleController } from './eating_schedule.controller';
import { EatingScheduleService } from './eating_schedule.service';

describe('EatingScheduleController', () => {
  let controller: EatingScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatingScheduleController],
      providers: [EatingScheduleService],
    }).compile();

    controller = module.get<EatingScheduleController>(EatingScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
