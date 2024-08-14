import { Module } from '@nestjs/common';
import { DailyScheduleService } from './daily-schedule.service';
import { DailyScheduleController } from './daily-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailySchedule } from 'src/common/entities/daily-schedule.entity';
import { Class } from 'src/common/entities/class.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailySchedule, Class, SchoolAdmin])],
  providers: [DailyScheduleService, JwtService],
  controllers: [DailyScheduleController],
})
export class DailyScheduleModule {}
