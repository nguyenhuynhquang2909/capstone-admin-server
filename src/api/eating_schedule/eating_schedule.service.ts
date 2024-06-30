import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EatingSchedule } from '../../common/entities/eating-schedule.entity';

@Injectable()
export class EatingScheduleService {
  constructor(
    @InjectRepository(EatingSchedule)
    private eatingScheduleRepository: Repository<EatingSchedule>,
  ) {}

  async findByDateRange(startDate: string, endDate: string): Promise<EatingSchedule[]> {
    return this.eatingScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.start_time >= :startDate', { startDate })
      .andWhere('schedule.end_time <= :endDate', { endDate })
      .getMany();
  }
}
