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
import { StudentService } from '../student/student.service';
import { Location } from 'src/common/entities/location.entity';
import { Subject } from 'src/common/entities/subject.entity';
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(SchoolAdmin)
    private readonly schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly teacherService: TeacherService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(ClassStudent)
    private readonly classStudentRepository: Repository<ClassStudent>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly studentService: StudentService
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
      .leftJoinAndSelect('class.location', 'location')
      .where('class.school_id = :school_id', { school_id })
      .select([
        'class.id',
        'class.name',  
        'class.school_year AS school_year', 
        'class.teacher_id',
        'teacher.id AS teacher_id',
        'teacher.name AS teacher_name',
        'class.location_id',
        'location.name AS location_name'
      ])
      .getRawMany();
  
    return classes.map((classEntity) => ({
      id: classEntity.class_id, 
      name: classEntity.class_name, 
      teacher_id: classEntity.teacher_id,
      teacher_name: classEntity.teacher_name,
      location_id: classEntity.location_id,
      location_name: classEntity.location_name,
      school_year: classEntity.school_year,
    }));
  }
  
  // async getClassStudents(classId: number): Promise<any[]> {
  //   const classEntity = await this.classRepository.findOne({
  //     where: { id: classId },
  //     relations: ['class_students', 'class_students.student'],
  //   });

  //   if (!classEntity) {
  //     throw new NotFoundException('Class not found for this school');
  //   }

  //   return classEntity.class_students.map((cs) => ({
  //     id: cs.student.id,
  //     name: cs.student.name,
  //     date_of_birth: cs.student.date_of_birth,
  //     gender: cs.student.gender,
  //   }));
  // }
  async getClassProfile(classId: number): Promise<any> {
    // Fetch the class entity with related teacher and students
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['teacher', 'class_students', 'class_students.student', 'location'],
    });
  
    // Throw an error if the class is not found
    if (!classEntity) {
      throw new NotFoundException('Class not found for this school');
    }
  
    // Fetch the teacher profile if a teacher exists for this class
    let teacherProfile = null;
    if (classEntity.teacher) {
      teacherProfile = await this.teacherService.getTeacherInfo(classEntity.teacher.id);
    }
  

    const classInfo = {
      id: classEntity.id,
      name: classEntity.name,
      school_year: classEntity.school_year,
      location_name: classEntity.location.name
    };
  
    const students = classEntity.class_students.map((cs) => ({
      id: cs.student.id,
      name: cs.student.name,
      date_of_birth: cs.student.date_of_birth,
      gender: cs.student.gender,
    }));
  
    // Return the class profile with class, teacher, and student info
    return {
      class: classInfo,
      teacher: teacherProfile,
      students: students,
    };
  }
  

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    const { name, teacherId, locationId, schoolYear } = createClassDto;
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const locationResult = await this.locationRepository.query(
      `
      SELECT * FROM locations WHERE id = $1
      `,
      [locationId]
    );
    const location = locationResult[0];
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    const newClass = this.classRepository.create({
      name,
      teacher_id: teacherId,
      school_id: teacher.school_id,
      location_id: locationId,
      school_year: schoolYear
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
    const { name, teacherId, locationId, schoolYear } = updateClassDto;
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
    if (locationId != undefined) {
      const locationResult = await this.locationRepository.query(
        `
        SELECT * FROM locations WHERE id = $1
        `,
        [locationId]
      );
      const location = locationResult[0];
      if (!location) {
        throw new NotFoundException('Location not found');
      }
      classEntity.location_id = locationId;
    }
    if (schoolYear != undefined) {
      classEntity.school_year = schoolYear;
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
  async getClassStudentProfile(classId: number, studentId: number): Promise<any> {
    const classEntity = await this.classRepository.findOne({
      where: {id: classId},
      relations: ['class_students']
    });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    const studentProfile = await this.studentService.getStudentProfile(studentId);
    return {
      className: classEntity.name,
      studentProfile  
    }
  }
 
}
