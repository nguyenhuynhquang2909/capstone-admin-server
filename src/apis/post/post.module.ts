import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { JwtService } from '../../common/jwt/jwt.service';
import { Media } from 'src/common/entities/media.entity';
import { MediaService } from '../media/media.service';
import { ToggleLike } from 'src/common/entities/toggle-like.entity';
import { PostClass } from 'src/common/entities/post-class.entity';
import { PostHashtag } from 'src/common/entities/post-hashtag.entity';
import { Comment } from 'src/common/entities/comment.entity';
import { PostMedia } from 'src/common/entities/post-media.entity';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoleConfigService } from '../../common/services/role-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, SchoolAdmin, Media, Comment,ToggleLike, PostClass, PostHashtag, PostMedia])],
  controllers: [PostController],
  providers: [PostService, JwtService, MediaService, JwtGuard, RoleGuard, RoleConfigService],
})
export class PostModule {}
