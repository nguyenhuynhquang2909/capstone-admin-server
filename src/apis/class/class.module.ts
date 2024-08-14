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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      SchoolAdmin,
      Teacher,
      Student,
      ClassStudent,
    ]),
  ],
  providers: [ClassService, JwtService],
  controllers: [ClassController],
})
export class ClassModule {}
