import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/common/entities/class.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { AddStudentToClassDto } from './dto/add-student-to-class.dto';
import { Student } from 'src/common/entities/student.entity';
import { ClassStudent } from 'src/common/entities/class-student.entity';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
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

  async getAllClasses(userId: number): Promise<any[]> {
    const school_id = await this.getSchoolIdForUser(userId);

    const classes = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.teacher', 'teacher')
      .where('class.school_id = :school_id', { school_id })
      .select([
        'class.id',
        'class.name',
        'class.teacher_id',
        'teacher.name AS teacher_name',
      ])
      .getRawMany();

    return classes.map((classEntity) => ({
      id: classEntity.class_id, // Ensure correct field names
      name: classEntity.class_name, // Ensure correct field names
      teacher_id: classEntity.teacher_id,
      teacher_name: classEntity.teacher_name,
    }));
  }

  async getClassStudents(classId: number): Promise<any[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['class_students', 'class_students.student'],
    });

    if (!classEntity) {
      throw new NotFoundException('Class not found for this school');
    }

    return classEntity.class_students.map((cs) => ({
      id: cs.student.id,
      name: cs.student.name,
      date_of_birth: cs.student.date_of_birth,
      gender: cs.student.gender,
    }));
  }

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    const { name, teacherId, classRoom } = createClassDto;
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const newClass = this.classRepository.create({
      name,
      teacher_id: teacherId,
      school_id: teacher.school_id,
      class_room: classRoom,
    });

    return await this.classRepository.save(newClass);
  }

  async addStudentToClass(
    classId: number,
    addStudentToClassDto: AddStudentToClassDto,
  ): Promise<void> {
    const { studentId } = addStudentToClassDto;

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['class_students'],
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const existingClassStudent = classEntity.class_students.find(
      (cs) => cs.student_id === studentId,
    );
    if (existingClassStudent) {
      throw new Error('Student is already in this class');
    }
    const classStudent = this.classStudentRepository.create({
      class: classEntity,
      student,
    });
    await this.classStudentRepository.save(classStudent);
  }

  async updateClass(
    classId: number,
    updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    const { name, teacherId, classRoom } = updateClassDto;
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    let teacher;
    if (teacher != undefined) {
      teacher = await this.teacherRepository.findOne({
        where: { id: teacherId },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      classEntity.teacher_id = teacherId;
      classEntity.school_id = teacher.school_id;
    }
    if (name != undefined) {
      classEntity.name = name;
    }
    if (classRoom != undefined) {
      classEntity.class_room = classRoom;
    }
    return await this.classRepository.save(classEntity);
  }

  async removeClass(classId: number): Promise<void> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    await this.classRepository.remove(classEntity);
  }
  async removeStudentFromClass(
    classId: number,
    studentId: number,
  ): Promise<void> {
    const classStudent = await this.classStudentRepository.findOne({
      where: { class: { id: classId }, student: { id: studentId } },
    });
    if (!classStudent) {
      throw new NotFoundException('Student not found in this class');
    }
    await this.classStudentRepository.remove(classStudent);
  }
}
