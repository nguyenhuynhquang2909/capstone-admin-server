import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../../common/entities/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { JwtService } from '../../common/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, SchoolAdmin])],
  providers: [MediaService, JwtService],
  controllers: [MediaController],
})
export class MediaModule {}
