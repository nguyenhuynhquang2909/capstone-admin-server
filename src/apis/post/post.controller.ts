import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';

// Decorators
import { Role } from '../../common/decorators/role.decorator';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
@UseGuards(JwtGuard, RoleGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtGuard: JwtGuard,
  ) {}

  // Create a post with status "draft"
  @Post('draft')
  @Role('schoolAdmin')
  async createDraft(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtGuard.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const newDraft = await this.postService.createDraft(createPostDto, userId);
    return newDraft;
  }

  // Update post (both draft and published)
  @Put(':id')
  @Role('schoolAdmin')
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtGuard.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const updatedPost = await this.postService.updatePost(
        postId,
        updatePostDto,
      );
      return updatedPost;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  // Publish post
  @Put(':id/publish')
  @Role('schoolAdmin')
  async publishPost(
    @Param('id') postId: number,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtGuard.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const publishedPost = await this.postService.publishPost(postId);
      return publishedPost;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
