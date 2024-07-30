import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { DailySchedule } from '../../common/entities/daily-schedule.entity';
import { EatingSchedule } from '../../common/entities/eating-schedule.entity';
import { Student } from '../../common/entities/student.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private readonly dailyScheduleRepository: Repository<DailySchedule>,
    @InjectRepository(EatingSchedule)
    private readonly eatingScheduleRepository: Repository<EatingSchedule>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async getLearningSchedule(
    userId: number,
    studentId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId, parent_id: userId },
      relations: ['class_students'],
    });

    if (!student) {
      throw new NotFoundException(
        'Student not found or user is not authorized.',
      );
    }

    const classIds = student.class_students.map((cs) => cs.class_id);

    return this.dailyScheduleRepository
      .createQueryBuilder('daily_schedule')
      .where('daily_schedule.class_id IN (:...classIds)', { classIds })
      .andWhere('daily_schedule.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }

  async getEatingSchedule(
    userId: number,
    studentId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId, parent_id: userId },
      relations: ['class_students'],
    });

    if (!student) {
      throw new NotFoundException(
        'Student not found or user is not authorized.',
      );
    }

    const classIds = student.class_students.map((cs) => cs.class_id);

    return this.eatingScheduleRepository
      .createQueryBuilder('eating_schedule')
      .where('eating_schedule.class_id IN (:...classIds)', { classIds })
      .andWhere('eating_schedule.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }
}
