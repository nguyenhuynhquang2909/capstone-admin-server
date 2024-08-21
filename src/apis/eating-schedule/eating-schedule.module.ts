import { Module } from '@nestjs/common';
import { EatingScheduleController } from './eating-schedule.controller';
import { EatingScheduleService } from './eating-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EatingSchedule } from 'src/common/entities/eating-schedule.entity';
import { MealMedia } from 'src/common/entities/meal-media.entity';
import { Media } from 'src/common/entities/media.entity';
import { MediaService } from '../media/media.service';
import { JwtService } from 'src/common/jwt/jwt.service';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EatingSchedule, MealMedia, Media, SchoolAdmin]),
  ],
  controllers: [EatingScheduleController],
  providers: [EatingScheduleService, MediaService, JwtService],
})
export class EatingScheduleModule {}
