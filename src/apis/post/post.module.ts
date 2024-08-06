import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { JwtService } from '../../common/jwt/jwt.service';
import { Media } from 'src/common/entities/media.entity';
import { MediaService } from '../media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, SchoolAdmin, Media])],
  controllers: [PostController],
  providers: [PostService, JwtService, MediaService],
})
export class PostModule {}
