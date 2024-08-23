import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/common/entities/teacher.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      SchoolAdmin
    ])
  ],
  providers: [TeacherService, JwtService],
  controllers: [TeacherController]
})
export class TeacherModule {}
