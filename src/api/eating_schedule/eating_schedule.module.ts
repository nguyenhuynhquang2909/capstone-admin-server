import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EatingScheduleController } from './eating_schedule.controller';
import { EatingScheduleService } from './eating_schedule.service';
import { EatingSchedule } from '../../common/entities/eating-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EatingSchedule])],
  controllers: [EatingScheduleController],
  providers: [EatingScheduleService],
})
export class EatingScheduleModule {}
