import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { JwtService } from '../../common/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, SchoolAdmin])],
  controllers: [PostController],
  providers: [PostService, JwtService],
})
export class PostModule {}
