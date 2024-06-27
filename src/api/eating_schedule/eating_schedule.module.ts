import { Module } from '@nestjs/common';
import { EatingScheduleService } from './eating_schedule.service';
import { EatingScheduleController } from './eating_schedule.controller';

@Module({
  controllers: [EatingScheduleController],
  providers: [EatingScheduleService],
})
export class EatingScheduleModule {}
