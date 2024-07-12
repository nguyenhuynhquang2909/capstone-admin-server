import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentImage } from '../../common/entities/student-image.entity';
import { Student } from '../../common/entities/student.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(StudentImage)
    private studentImageRepository: Repository<StudentImage>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(userId: number): Promise<string[]> {
    const students = await this.studentRepository.find({
      where: { parent_id: userId },
      relations: ['studentImages', 'studentImages.image'],
    });

    const imageUrls = students.flatMap(student => 
      student.studentImages.map(studentImage => studentImage.image.url)
    );

    return imageUrls;
  }
}
