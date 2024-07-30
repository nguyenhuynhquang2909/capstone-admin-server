import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { Student } from '../../common/entities/student.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async getMedia(userId: number) {
    const students = await this.studentRepository.find({
      where: { parent_id: userId },
      relations: ['student_media', 'student_media.media'],
    });

    if (!students.length) {
      throw new NotFoundException('No students found for this user');
    }

    const media = students.flatMap((student) =>
      student.student_media.map((sm) => sm.media),
    );

    return media;
  }

  async getStudentMedia(userId: number, studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId, parent_id: userId },
      relations: ['student_media', 'student_media.media'],
    });

    if (!student) {
      throw new NotFoundException(
        'Student not found or does not belong to this user',
      );
    }

    const media = student.student_media.map((sm) => sm.media);

    return media;
  }
}
