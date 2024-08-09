import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailySchedule } from 'src/common/entities/daily-schedule.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DailyScheduleService {
    constructor(
        @InjectRepository(DailySchedule)
        private readonly scheduleRepository: Repository<DailySchedule>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>
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
}
