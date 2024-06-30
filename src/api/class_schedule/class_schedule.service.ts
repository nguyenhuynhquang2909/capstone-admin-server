import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailySchedule } from '../../common/entities/daily-schedule.entity';
import { Student } from '../../common/entities/student.entity';
import { ClassStudent } from '../../common/entities/class-student.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private dailyScheduleRepository: Repository<DailySchedule>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(ClassStudent)
    private classStudentRepository: Repository<ClassStudent>,
  ) {}

  async findByDateRange(userId: number, startDate: string, endDate: string): Promise<DailySchedule[]> {
    return this.dailyScheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin(ClassStudent, 'classStudent', 'classStudent.class_id = schedule.class_id')
      .innerJoin(Student, 'student', 'student.id = classStudent.student_id')
      .where('student.parent_id = :userId', { userId })
      .andWhere('schedule.start_time >= :startDate', { startDate })
      .andWhere('schedule.end_time <= :endDate', { endDate })
      .andWhere('student.parent_id = :userId', { userId })
      .select([
        'schedule.id',
        'schedule.class_id',
        'schedule.start_time',
        'schedule.end_time',
        'schedule.subject'
      ])
      .getMany();
  }
}
