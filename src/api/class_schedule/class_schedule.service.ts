import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySchedule } from '../../common/entities/daily-schedule.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private dailyScheduleRepository: Repository<DailySchedule>,
  ) {}

  async findByDateRange(startDate: string, endDate: string): Promise<DailySchedule[]> {
    return this.dailyScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.start_time >= :startDate', { startDate })
      .andWhere('schedule.end_time <= :endDate', { endDate })
      .getMany();
  }
}
