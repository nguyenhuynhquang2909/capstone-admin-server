import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { Repository } from 'typeorm';
import { StudentProfileDto } from './dto/student-profile.dto';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { User } from 'src/common/entities/user.entity';
import { Media } from 'src/common/entities/media.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(SchoolAdmin)
    private schoolAdminRepository: Repository<SchoolAdmin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private readonly mediaService: MediaService,
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
  async getAllStudentsForSchool(
    userId: number,
  ): Promise<{ id: number; name: string }[]> {
    const schoolId = await this.getSchoolIdForUser(userId);

    const students = await this.studentRepository
      .createQueryBuilder('student')
      .select(['student.id', 'student.name'])
      .where('student.school_id = :schoolId', { schoolId })
      .getMany();

    return students.map((student) => ({
      id: student.id,
      name: student.name,
    }));
  }
  async getStudentProfile(studentId: number): Promise<StudentProfileDto> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: [
        'school',
        'parent',
        'class_students',
        'class_students.class',
        'student_media',
      ],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    let avatarUrl = '';
    if (student.student_media.length > 0) {
      avatarUrl = student.student_media[0].media.url;
    } else {
      avatarUrl =
        'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg';
    }
    const studentProfile: StudentProfileDto = {
      studentName: student.name,
      schoolName: student.school.name,
      gender: student.gender as Gender,
      dateOfBirth: student.date_of_birth,
      parentName: student.parent.name,
      parentPhoneNumber: student.parent.phone,
      avatarUrl: avatarUrl,
      classes: student.class_students.map((classStudent) => ({
        className: classStudent.class.name,
      })),
    };
    return studentProfile;
  }
  async enrollNewStudent(
    enrollStudentDto: EnrollStudentDto,
    userId: number,
  ): Promise<Student> {
    const { studentName, dateOfBirth, gender, parentName, parentPhone } =
      enrollStudentDto;
    const schoolId = await this.getSchoolIdForUser(userId);
    let parent = await this.userRepository.findOne({
      where: { phone: parentPhone },
    });
    if (!parent) {
      parent = await this.userRepository.create({
        name: parentName,
        phone: parentPhone,
        role_id: 1,
        is_active: true,
      });
    } else {
      parent.role_id = 1;
      parent.is_active = true;
    }
    await this.userRepository.save(parent);
    const newStudent = this.studentRepository.create({
      name: studentName,
      date_of_birth: dateOfBirth,
      gender: gender as Gender,
      school_id: schoolId,
      parent: parent,
    });
    return await this.studentRepository.save(newStudent);
  }
  async updateStudent(
    studentId: number,
    updateStudentDto: UpdateStudentDto,
    files: Express.Multer.File[],
    userId: number,
  ): Promise<Student> {
    const studentResult = await this.studentRepository.query(
      `
                SELECT s.*, u.name AS parent_name, u.phone AS parent_phone, sm.media_id, m.url AS media_url
                FROM students s
                JOIN users u ON s.parent_id = u.id
                LEFT JOIN student_media sm ON s.id = sm.student_id
                LEFT JOIN media m ON sm.media_id = m.id
                WHERE s.id = $1
                `,
      [studentId],
    );
    if (studentResult.length === 0) {
      throw new NotFoundException('Student not found');
    }

    const student = studentResult[0];

    if (updateStudentDto.studentName) {
      student.name = updateStudentDto.studentName;
    }
    if (updateStudentDto.parentName || updateStudentDto.parentPhone) {
      const parentResult = await this.userRepository.query(
        `
                    SELECT *
                    FROM users
                    WHERE id = $1
                    `,
        [student.parent_id],
      );
      if (parentResult.length === 0) {
        throw new NotFoundException('Parent not found');
      }
      const parent = parentResult[0];
      if (!parent) {
        throw new NotFoundException('Parent not found');
      }
      if (updateStudentDto.parentName) {
        parent.name = updateStudentDto.parentName;
      } else if (updateStudentDto.parentPhone) {
        parent.phone = updateStudentDto.parentPhone;
      }
      await this.userRepository.query(
        `
                    UPDATE users
                    SET name = $1, phone = $2
                    WHERE id = $3
                    `,
        [parent.name, parent.phone, parent.id],
      );
    }

    if (files && files.length > 0) {
      await this.removeOldAvatar(student.id);
      const media = await this.mediaService.uploadMedia(files, userId);
      for (const mediaItem of media) {
        if (!studentId) {
          console.error('Student ID is null or undefined');
          throw new Error('Student ID is null or undefined');
        }
        await this.associateMediaWithStudent(studentId, mediaItem.id);
      }
    }

    await this.studentRepository.query(
      `
                UPDATE students
                SET name = $1
                WHERE id = $2
                `,
      [student.name, student.id],
    );
    return student;
  }

  async deleteStudent(studentId: number): Promise<void> {
    const studentResult = await this.studentRepository.query(
      `
                SELECT s.*, sm.media_id, m.url AS media_url
                FROM students s
                LEFT JOIN student_media sm ON s.id = sm.student_id
                LEFT JOIN media m ON sm.media_id = m.id
                WHERE s.id = $1
                `,
      [studentId],
    );
    if (studentResult.length == 0) {
      throw new NotFoundException('Student not found');
    }
    const student = studentResult[0];
    if (student.media_id) {
      await this.mediaService.deleteMedia(student.media_id);
      await this.studentRepository.query(
        'DELETE FROM student_media WHERE student_id = $1 AND media_id = $2',
        [studentId, student.media_id],
      );
    }
    await this.studentRepository.query('DELETE FROM students WHERE id = $1', [
      studentId,
    ]);
  }
  async removeOldAvatar(studentId: number): Promise<void> {
    const studentResult = await this.studentRepository.query(
      `
                SELECT s.id AS student_id, sm.media_id, m.url AS media_url
                FROM students s
                LEFT JOIN student_media sm ON s.id = sm.student_id
                LEFT JOIN media m ON sm.media_id = m.id
                WHERE s.id = $1
                `,
      [studentId],
    );

    if (studentResult.length === 0) {
      throw new NotFoundException('Student not found');
    }

    const student = studentResult[0];

    // Check if there's media associated with the student
    if (!student.media_id) {
      return; // No media to remove
    }

    // Delete the media from S3 and the database
    await this.mediaService.deleteMedia(student.media_id);

    // Remove the association from the student_media table
    await this.studentRepository.query(
      'DELETE FROM student_media WHERE student_id = $1 AND media_id = $2',
      [studentId, student.media_id],
    );

    // Remove the media record from the media table
    await this.mediaRepository.query('DELETE FROM media WHERE id = $1', [
      student.media_id,
    ]);
  }

  async associateMediaWithStudent(studentId: number, mediaId: number) {
    const mediaExists = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!mediaExists) {
      throw new NotFoundException('Media not found');
    }
    await this.mediaRepository.query(
      'INSERT INTO student_media (student_id, media_id) VALUES ($1, $2)',
      [studentId, mediaId],
    );
  }
}
