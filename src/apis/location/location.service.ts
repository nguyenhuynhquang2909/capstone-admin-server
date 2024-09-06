import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/common/entities/location.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
        @InjectRepository(SchoolAdmin)
        private readonly schoolAdminRepository: Repository<SchoolAdmin>
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
    async getAllLocations(userId: number): Promise<Location[]> {
        const schoolId = await this.getSchoolIdForUser(userId);
        const locations = await this.locationRepository.find({
            where: {school: {id: schoolId}}
        });
        return locations;
    }
}
