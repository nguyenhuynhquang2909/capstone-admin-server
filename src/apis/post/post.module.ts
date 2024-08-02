import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from '../../common/entities/post.entity';
import { SchoolAdmin } from '../../common/entities/school-admin.entity';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoleConfigService } from '../../common/services/role-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, SchoolAdmin])],
  controllers: [PostController],
  providers: [PostService, JwtGuard, RoleGuard, RoleConfigService],
})
export class PostModule {}
