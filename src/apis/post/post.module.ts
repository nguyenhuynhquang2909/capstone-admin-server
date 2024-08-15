import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MediaService } from '../media/media.service';
import { PushNotificationService } from '../../common/services/push-notification.service';
import { FirebaseAdminService } from '../../common/services/firebase-admin.service';

// Entities
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';
import { JwtService } from '../../common/jwt/jwt.service';
import { Media } from 'src/common/entities/media.entity';
import { ToggleLike } from 'src/common/entities/toggle-like.entity';
import { PostClass } from 'src/common/entities/post-class.entity';
import { PostHashtag } from 'src/common/entities/post-hashtag.entity';
import { Comment } from 'src/common/entities/comment.entity';
import { PostMedia } from 'src/common/entities/post-media.entity';
import { ClassStudent } from 'src/common/entities/class-student.entity';
import { DeviceToken } from 'src/common/entities/device-token.entity';

// Guard
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RoleConfigService } from 'src/common/services/role-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      SchoolAdmin,
      Media,
      Comment,
      ToggleLike,
      PostClass,
      PostHashtag,
      PostMedia,
      ClassStudent,
      DeviceToken,
    ]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    JwtService,
    MediaService,
    PushNotificationService,
    FirebaseAdminService,
    JwtGuard,
    RoleGuard,
    RoleConfigService,
  ],
})
export class PostModule {}
