import { Test, TestingModule } from '@nestjs/testing';
import { EatingScheduleController } from './eating-schedule.controller';

describe('EatingScheduleController', () => {
  let controller: EatingScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EatingScheduleController],
    }).compile();

    controller = module.get<EatingScheduleController>(EatingScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
