import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassScheduleController } from './class_schedule.controller';
import { ClassScheduleService } from './class_schedule.service';
import { DailySchedule } from '../../common/entities/daily-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySchedule])],
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService],
})
export class ClassScheduleModule {}
