import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

// Entities
import { Post } from '../../common/entities/post.entity';
import { PostClass } from '../../common/entities/post-class.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { Comment } from '../../common/entities/comment.entity';
import { Student } from '../../common/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostClass, ToggleLike, Comment, Student]),
  ],
  providers: [PostService, JwtService],
  controllers: [PostController],
})
export class PostModule {}
