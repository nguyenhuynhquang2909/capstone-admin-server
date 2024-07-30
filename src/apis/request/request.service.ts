import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTO
import { CreateRequestDto } from './dto/create-request.dto';

// Entities
import { Student } from '../../common/entities/student.entity';
import { Request } from '../../common/entities/request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async createRequest(
    userId: number,
    studentId: number,
    createRequestDto: CreateRequestDto,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId, parent_id: userId },
      relations: ['class_students'],
    });

    if (!student) {
      throw new NotFoundException(
        'Student not found or does not belong to this user',
      );
    }

    const classId =
      student.class_students && student.class_students.length > 0
        ? student.class_students[0].class_id
        : null;

    const newRequest = this.requestRepository.create({
      ...createRequestDto,
      student_id: studentId,
      class_id: classId,
      status: 'pending',
    });

    return this.requestRepository.save(newRequest);
  }

  async getRequestHistory(userId: number) {
    const students = await this.studentRepository.find({
      where: { parent_id: userId },
      relations: ['requests'],
    });
    const requests = students.flatMap((student) => student.requests);
    return requests;
  }
}
