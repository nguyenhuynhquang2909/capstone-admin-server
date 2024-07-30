import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Student } from '../../common/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [MediaController],
  providers: [MediaService, JwtService],
})
export class MediaModule {}
