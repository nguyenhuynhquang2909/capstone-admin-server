import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class_schedule.service';
import { ClassScheduleController } from './class_schedule.controller';

@Module({
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService],
})
export class ClassScheduleModule {}
