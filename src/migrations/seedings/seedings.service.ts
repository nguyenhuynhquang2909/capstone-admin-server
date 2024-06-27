import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Teacher } from '../../common/entities/teacher.entity';
import { Class } from '../../common/entities/class.entity';
import { Student } from '../../common/entities/student.entity';
import { DailySchedule } from '../../common/entities/daily-schedule.entity';
import { Absence } from '../../common/entities/absence.entity';
import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { Post } from '../../common/entities/post.entity';
import { Hashtag } from '../../common/entities/hashtag.entity';
import { Image } from '../../common/entities/image.entity';
import { Comment } from '../../common/entities/comment.entity';
import { PostHashtag } from '../../common/entities/post-hashtag.entity';
import { School } from '../../common/entities/school.entity';
import { ClassStudent } from '../../common/entities/class-student.entity';
import { EatingSchedule } from '../../common/entities/eating-schedule.entity';

@Injectable()
export class SeedingsService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = new Role();
      role.name = 'Admin';
      await queryRunner.manager.save(role);

      const school = new School();
      school.name = 'School 1';
      await queryRunner.manager.save(school);

      const teacher = new Teacher();
      teacher.name = 'Wibu';
      teacher.school = school;
      await queryRunner.manager.save(teacher);

      const user = new User();
      user.name = 'admin';
      user.email = 'admin@example.com';
      user.password = 'password'; // Ensure to hash the password in real applications
      user.phone = '555-555-5555';
      user.role = role;
      await queryRunner.manager.save(user);

      const classEntity = new Class();
      classEntity.name = 'Math 101';
      classEntity.teacher = teacher;
      classEntity.school = school;
      await queryRunner.manager.save(classEntity);

      const student = new Student();
      student.name = 'Alice Smith';
      student.parent_id = user.id;
      student.school = school;
      await queryRunner.manager.save(student);

      const classStudent = new ClassStudent();
      classStudent.classEntity = classEntity;
      classStudent.student = student;
      await queryRunner.manager.save(classStudent);

      const dailySchedule = new DailySchedule();
      dailySchedule.classEntity = classEntity;
      dailySchedule.schedule_time = new Date('2023-01-10T08:00:00Z');
      await queryRunner.manager.save(dailySchedule);

      const absence = new Absence();
      absence.student = student;
      absence.classEntity = classEntity;
      absence.dailySchedule = dailySchedule;
      await queryRunner.manager.save(absence);

      const eatingSchedule = new EatingSchedule();
      eatingSchedule.classEntity = classEntity;
      eatingSchedule.schedule_time = new Date('2023-01-10T12:00:00Z');
      await queryRunner.manager.save(eatingSchedule);

      const post = new Post();
      post.title = 'First Post';
      post.content = 'This is the content of the first post.';
      post.user = user;
      post.school = school;
      post.status = 'published';
      await queryRunner.manager.save(post);

      const hashtag = new Hashtag();
      hashtag.tag = 'Education';
      await queryRunner.manager.save(hashtag);

      const postHashtag = new PostHashtag();
      postHashtag.post = post;
      postHashtag.hashtag = hashtag;
      postHashtag.placeholderNumber = 1;
      await queryRunner.manager.save(postHashtag);

      const image = new Image();
      image.url = 'http://example.com/image.jpg';
      image.post = post;
      await queryRunner.manager.save(image);

      const comment = new Comment();
      comment.content = 'Great post!';
      comment.post = post;
      comment.user = user;
      await queryRunner.manager.save(comment);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
