import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { JwtService } from 'src/common/jwt/jwt.service';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { User } from 'src/common/entities/user.entity';
import { Media } from 'src/common/entities/media.entity';
import { PostMedia } from '../../common/entities/post-media.entity';
import { StudentMedia } from '../../common/entities/student-media.entity';
import { MealMedia } from '../../common/entities/meal-media.entity';
import { MediaService } from '../media/media.service';
import { Class } from 'src/common/entities/class.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      SchoolAdmin,
      User,
      Media,
      StudentMedia,
      Class,
      PostMedia,
      MealMedia,
    ]),
    UserModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, JwtService, MediaService],
  exports: [StudentService, MediaService],
})
export class StudentModule {}
