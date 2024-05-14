import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { PostService } from './post.service';
import { PostController } from './post.controller';

import { AuthService } from '../auth/auth.service';

import { JwtStrategy } from '../../common/guards/jwt.strategy';

import { Post } from '../../common/entities/post.entity';
import { School } from '../../common/entities/school.entity';
import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { Image } from '../../common/entities/image.entity';
import { Comment } from '../../common/entities/comment.entity';
import { ToggleLike } from '../../common/entities/toggle-like.entity';
import { UserSession } from '../../common/entities/user-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      School,
      User,
      Role,
      Comment,
      ToggleLike,
      UserSession,
      Image,
    ]),
    JwtModule.register({
      secret: '123456',
      signOptions: { expiresIn: '10368000s' },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, AuthService, JwtStrategy],
})
export class PostModule {}
