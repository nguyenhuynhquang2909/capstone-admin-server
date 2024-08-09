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
    
      async getAllClasses(userId: number): Promise<any[]> {
        const school_id = await this.getSchoolIdForUser(userId);
    
        const classes = await this.classRepository
          .createQueryBuilder('class')
          .leftJoinAndSelect('class.teacher', 'teacher')
          .where('class.school_id = :school_id', { school_id })
          .select(['class.id', 'class.name', 'class.teacher_id', 'teacher.name AS teacher_name'])
          .getRawMany();
    
        return classes.map(classEntity => ({
          id: classEntity.class_id,            // Ensure correct field names
          name: classEntity.class_name,        // Ensure correct field names
          teacher_id: classEntity.teacher_id,
          teacher_name: classEntity.teacher_name,
        }));
    }
    async getClassStudents(classId: number): Promise<string[]> {

        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
            relations: ['class_students', 'class_students.student'],
          });
        if (!classEntity) {
            throw new NotFoundException('Class not found for this school');
        }
        const studentNames = classEntity.class_students.map((cs) => cs.student.name);
        return studentNames;
    }

    
    
}
