import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailySchedule } from 'src/common/entities/daily-schedule.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateDailyScheduleDto } from './dto/create-daily-schedule.dto';
import { Class } from 'src/common/entities/class.entity';

@Injectable()
export class DailyScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private readonly scheduleRepository: Repository<DailySchedule>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: userId },
    });
    if (!schoolAdmin) {
      throw new NotFoundException('School not found for this user');
    }
    return schoolAdmin.school_id;
  }

  async getAllSchedules(userId: number): Promise<any> {
    const schoolId = await this.getSchoolIdForUser(userId);
    const schedules = await this.scheduleRepository.find({
      where: { class: { school_id: schoolId } },
      relations: ['class', 'subject'],
    });
  
    // Initialize a structure to hold schedules organized by day and time slots
    const weekSchedule = {};
  
    schedules.forEach(schedule => {
      const day = schedule.start_time.toISOString().split('T')[0]; // Get the day (e.g., "2024-08-21")
      const startTime = schedule.start_time.toISOString().split('T')[1].slice(0, 5); // Get the start time (e.g., "08:00")
      const endTime = schedule.end_time.toISOString().split('T')[1].slice(0, 5); // Get the end time (e.g., "09:00")
  
      // Create an entry for the day if it doesn't exist
      if (!weekSchedule[day]) {
        weekSchedule[day] = [];
      }
  
      // Add the schedule to the corresponding day and time slot
      weekSchedule[day].push({
        startTime: startTime,
        endTime: endTime,
        subjectName: schedule.subject.name,
        classId: schedule.class_id,
        teacherId: schedule.teacher_id,
        locationId: schedule.location_id,
      });
    });
  
    return weekSchedule;
  }
  

  async createDailySchedule(
    CreateDailyScheduleDto: CreateDailyScheduleDto,
    userId: number,
  ): Promise<DailySchedule> {
    const {
      class_id,
      start_time,
      end_time,
      subject_id,
      teacher_id,
      location_id,
    } = CreateDailyScheduleDto;
    const schoolId = await this.getSchoolIdForUser(userId);
    const classEntity = await this.classRepository.findOne({
      where: { id: class_id, school_id: schoolId },
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found for this school');
    }

    const overlappingSchedule = await this.scheduleRepository.findOne({
      where: {
        class_id: class_id,
        start_time: LessThanOrEqual(end_time),
        end_time: MoreThanOrEqual(start_time)
      }
    })

    if (overlappingSchedule) {
      throw new Error('Schedule overlaps with an existing schedule');
    }

    const newSchedule = this.scheduleRepository.create({
      class_id,
      start_time,
      end_time,
      subject_id,
      teacher_id,
      location_id,
    });
    return await this.scheduleRepository.save(newSchedule);
  }
}
