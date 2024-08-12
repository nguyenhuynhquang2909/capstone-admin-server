import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Media } from '../../common/entities/media.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, SchoolAdmin])],
  providers: [MediaService, JwtService],
  controllers: [MediaController],
})
export class MediaModule {}
