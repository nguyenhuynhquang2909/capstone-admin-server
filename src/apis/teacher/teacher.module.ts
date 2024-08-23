import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/common/entities/teacher.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { JwtService } from 'src/common/jwt/jwt.service';
import { Media } from 'src/common/entities/media.entity';
import { MediaService } from '../media/media.service';
import { TeacherMedia } from 'src/common/entities/teacher-media.entity';
import { PostMedia } from 'src/common/entities/post-media.entity';
import { MediaModule } from '../media/media.module';
import { StudentMedia } from 'src/common/entities/student-media.entity';
import { MealMedia } from 'src/common/entities/meal-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Teacher,
      SchoolAdmin,
      Media,
      TeacherMedia,
      StudentMedia,
      PostMedia,
      MealMedia,
    ])
  ],
  providers: [TeacherService, JwtService, MediaService],
  controllers: [TeacherController],
  exports: [TeacherService, MediaService]
})
export class TeacherModule {}
