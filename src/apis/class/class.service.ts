import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/common/entities/class.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private readonly classRepository: Repository<Class>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>
    ) {}

    async getSchoolIdForUser(userId: number): Promise<number> {
        const schoolAdmin = await this.schoolAdminRepository.findOne({ where: { user_id: userId } });
        if (!schoolAdmin) {
          throw new NotFoundException('School not found for this user');
        }
        return schoolAdmin.school_id;
      }
    async getAllClasses(userId: number): Promise<Class[]> {
        const schoolId = await this.getSchoolIdForUser(userId);
        return await this.classRepository.find({where: {school_id: schoolId}});
    }
}
