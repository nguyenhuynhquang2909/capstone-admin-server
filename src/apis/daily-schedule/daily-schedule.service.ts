import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailySchedule } from 'src/common/entities/daily-schedule.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Repository } from 'typeorm';
import { CreateDailyScheduleDto } from './dto/create-daily-schedule.dto';
import { Class } from 'src/common/entities/class.entity';
import { UpdateDailyScheduleDto } from './dto/update-daily-schedule.dto';
import { Subject } from 'src/common/entities/subject.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Location } from 'src/common/entities/location.entity';


@Injectable()
export class DailyScheduleService {
  constructor(
    @InjectRepository(DailySchedule)
    private readonly scheduleRepository: Repository<DailySchedule>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,


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
      relations: ['class', 'subject', 'teacher', 'location'],
    });

    // Initialize a structure to hold schedules organized by day and time slots
    return schedules.map((schedule) => ({
      id: schedule.id,
      startTime: schedule.start_time, // e.g., "08:00"
      endTime: schedule.end_time, // e.g., "09:00"
      subjectName: schedule.subject.name,
      classId: schedule.class_id,
      className: schedule.class.name,
      teacherId: schedule.teacher_id,
      teacherName: schedule.teacher.name,
      locationId: schedule.location_id,
    }));

  }
  async getSchedulesForEachClass(classId: number): Promise<any> {
    const classSchedules = await this.scheduleRepository.find({
      where: {class_id: classId},
      relations: ['class', 'subject', 'teacher', 'location'],
    })
    return classSchedules.map((schedule) => ({
      id: schedule.id,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      subjectName: schedule.subject.name,
      classId: schedule.class_id,
      teacherId: schedule.teacher_id,
      teacherName: schedule.teacher.name,
      locationId: schedule.location_id,
      locationName: schedule.location.name,
    }));
  }
  private async checkForOverlappingSchedule(schedule: DailySchedule) {
    const overlappingSchedules = await this.scheduleRepository.find({
      where: {
        class_id: schedule.class_id,
        location_id: schedule.location_id,
        teacher_id: schedule.teacher_id,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      },
    });

    if (overlappingSchedules.length > 0) {
      throw new Error('Schedule overlaps with an existing schedule');
    }
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

    const newSchedule = this.scheduleRepository.create({
      class_id,
      start_time,
      end_time,
      subject_id,
      teacher_id,
      location_id,
    });
    await this.checkForOverlappingSchedule(newSchedule);
    return await this.scheduleRepository.save(newSchedule);
  }

  async updateDailySchedule(
    scheduleId: number,
    updateDailyScheduleDto: UpdateDailyScheduleDto,
    userId: number,
  ): Promise<any> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['teacher', 'subject']
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found for this school');
    }
    const schoolId = await this.getSchoolIdForUser(userId);
    const classEntity = await this.classRepository.findOne({
      where: { id: schedule.class_id, school_id: schoolId },
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    const subject = await this.subjectRepository.findOne({ where: { id: schedule.subject?.id } });
    const teacher = await this.teacherRepository.findOne({ where: { id: schedule.teacher?.id } });
    Object.assign(schedule, updateDailyScheduleDto);
  
    if (updateDailyScheduleDto.start_time || updateDailyScheduleDto.end_time) {
      await this.checkForOverlappingSchedule(schedule);
    }
    const updatedSchedule = await this.scheduleRepository.save(schedule);
    return {
      ...updatedSchedule,
      subject_name: subject.name,
      class_name: classEntity.name,
      teacher_name: teacher.name
    };
  }
  async deleteSchedule(scheduleId: number, userId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    const schoolId = await this.getSchoolIdForUser(userId);
    const classEntity = await this.classRepository.findOne({
      where: { id: schedule.class_id, school_id: schoolId },
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found for this school');
    }
    await this.scheduleRepository.remove(schedule);
  }



  
}
