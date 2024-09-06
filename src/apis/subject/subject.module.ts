import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/common/entities/subject.entity';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subject
    ])
  ],
  providers: [SubjectService, JwtService],
  controllers: [SubjectController]
})
export class SubjectModule {}
