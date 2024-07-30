import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { DailySchedule } from '../../common/entities/daily-schedule.entity';
import { EatingSchedule } from '../../common/entities/eating-schedule.entity';
import { Student } from '../../common/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailySchedule, EatingSchedule, Student])],
  controllers: [ScheduleController],
  providers: [ScheduleService, JwtService],
})
export class ScheduleModule {}
