import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { JwtService } from 'src/common/jwt/jwt.service';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      SchoolAdmin
    ])
  ],
  controllers: [StudentController],
  providers: [StudentService, JwtService]
})
export class StudentModule {}
