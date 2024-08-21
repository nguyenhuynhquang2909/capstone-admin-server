import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from '../../common/entities/request.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { Class } from '../../common/entities/class.entity';
import { In } from 'typeorm';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,

    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  // Fetch the school ID associated with the user
  async getSchoolIdForUser(userId: number): Promise<number> {
    const schoolAdmin = await this.schoolAdminRepository.findOne({
      where: { user_id: userId },
    });

    if (!schoolAdmin) {
      throw new Error('User is not associated with any school');
    }

    return schoolAdmin.school_id;
  }

  // Fetch all requests related to classes that belong to the user's school
  async getRequestsBySchoolId(schoolId: number): Promise<Request[]> {
    const classes = await this.classRepository.find({
      where: { school_id: schoolId },
      relations: ['requests'],
    });

    const classIds = classes.map((classEntity) => classEntity.id);

    return this.requestRepository.find({
      where: {
        class_id: In(classIds),
      },
      relations: ['student', 'class'],
    });
  }

  // Update the status of a request
  async updateRequestStatus(requestId: number, newStatus: string): Promise<Request> {
    // Fetch the request to ensure it exists
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Request not found');
    }

    // Ensure the status can be updated
    if (request.status !== 'pending') {
      throw new Error('Request is not in a status that can be approved');
    }

    // Validate the new status
    if (newStatus !== 'approved') {
      throw new Error('Invalid status value');
    }

    // Update the request status
    request.status = newStatus;
    return this.requestRepository.save(request);
  }
}
