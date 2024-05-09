import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from '../../common/entities/post.entity';
import { School } from '../../common/entities/school.entity';
import { User } from '../../common/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, School, User])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
