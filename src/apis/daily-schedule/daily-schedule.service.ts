import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailySchedule } from 'src/common/entities/daily-schedule.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Repository } from 'typeorm';
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
        private readonly classRepository: Repository<Class>
    ) {}
    async getSchoolIdForUser(userId: number): Promise<number> {
        const schoolAdmin = await this.schoolAdminRepository.findOne({where: {user_id: userId}});
        if (!schoolAdmin) {
            throw new NotFoundException('School not found for this user');
        }
        return schoolAdmin.school_id;
    }
    async getAllSchedules(userId): Promise<DailySchedule[]> {
        const schoolId = await this.getSchoolIdForUser(userId);
        return await this.scheduleRepository.find({
            where: {class: {school_id: schoolId}},
            relations: ['class']
        })
    }
    async createDailySchedule(CreateDailyScheduleDto: CreateDailyScheduleDto, userId: number): Promise<DailySchedule> {
        const {class_id, start_time, end_time, subject} = CreateDailyScheduleDto;
        const schoolId = await this.getSchoolIdForUser(userId);
        const classEntity = await this.classRepository.findOne({ where: { id: class_id, school_id: schoolId } });
        if(!classEntity) {
            throw new NotFoundException("Class not found for this school");
        }
        
        // wrong input
        const newSchedule = this.scheduleRepository.create({
            class_id,
            start_time,
            end_time,
            
            // Not including subject
            subject
        });
        return await this.scheduleRepository.save(newSchedule);
    };
    
}
