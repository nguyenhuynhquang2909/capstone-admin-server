import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Request } from '../../common/entities/request.entity';
import { Student } from '../../common/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Student])],
  controllers: [RequestController],
  providers: [RequestService, JwtService],
})
export class RequestModule {}
