import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Absence } from 'src/common/entities/absence.entity';
import { CreateAbsenceDto } from './dto/create-absence.dto';
import { Student } from 'src/common/entities/student.entity';
import { ClassStudent } from 'src/common/entities/class-student.entity';
import { AbsenceStatus } from 'src/common/enum/absence_status.enum';


@Injectable()
export class AbsenceService {
    constructor(
        @InjectRepository(Absence)
        private absenceRepository: Repository<Absence>, 

        @InjectRepository(Student)
        private studentRepository: Repository<Student>,

        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>
    ) {}

    async findAllAbsences(parentId: number): Promise<Absence[]> {
        return this.absenceRepository
          .createQueryBuilder('absence')
          .innerJoinAndSelect('absence.student', 'student')
          .where('student.parent_id = :parent_id', { parent_id: parentId }) // use correct placeholder
          .getMany();
      }
    
      async createAbsence(parentId: number, createAbsenceDto: CreateAbsenceDto): Promise<Absence> {
        const classStudent = await this.classStudentRepository
          .createQueryBuilder('cs')
          .innerJoinAndSelect('cs.student', 'student')
          .where('student.parent_id = :parent_id', { parent_id: parentId })
          .getOne();
    
        if (!classStudent) {
          throw new NotFoundException('Không tìm thấy học sinh');
        }
    
        const existingAbsence = await this.absenceRepository.findOne({
          where: {
            student_id: classStudent.student_id,
            class_id: classStudent.class_id,
            start_time: createAbsenceDto.start_time,
            end_time: createAbsenceDto.end_time,
          },
        });
    
        if (existingAbsence) {
          throw new ConflictException('Absence record already exists for the specified student and class during this period.');
        }
    
        const absence = this.absenceRepository.create({
          ...createAbsenceDto,
          student_id: classStudent.student_id,
          class_id: classStudent.class_id,
          absence_status: createAbsenceDto.absence_status || AbsenceStatus.Pending,
        });
    
        console.log('Creating absence: ', absence);
         await this.absenceRepository.insert(absence);
    
        // Manually returning the absence object
        return absence;
      }

}
