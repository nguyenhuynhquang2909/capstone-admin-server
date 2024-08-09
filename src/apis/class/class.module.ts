import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/common/entities/class.entity';
import { SchoolAdmin } from 'src/common/entities/school-admin.entity';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, SchoolAdmin])
  ],
  providers: [ClassService, JwtService],
  controllers: [ClassController]
})
export class ClassModule {}
