import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/common/entities/class.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Teacher } from 'src/common/entities/teacher.entity';
import { Student } from 'src/common/entities/student.entity';
import { ClassStudent } from 'src/common/entities/class-student.entity';
import { StudentService } from '../student/student.service';
import { User } from 'src/common/entities/user.entity';
import { Media } from 'src/common/entities/media.entity';
import { StudentModule } from '../student/student.module';
import { Location } from 'src/common/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      SchoolAdmin,
      Teacher,
      Student,
      ClassStudent,
      User,
      Media,
      Location
    ]),
    StudentModule
  ],
  providers: [ClassService, JwtService, StudentService],
  controllers: [ClassController],
})
export class ClassModule {}
