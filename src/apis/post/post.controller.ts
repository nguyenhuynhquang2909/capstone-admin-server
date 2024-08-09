import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  ForbiddenException,
  UploadedFiles,
  UseInterceptors,
  Get,
  Delete,
  UseGuards
} from '@nestjs/common';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';

// Decorators
import { Role } from '../../common/decorators/role.decorator';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { MediaService } from '../media/media.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { error } from 'console';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
@UseGuards(JwtGuard, RoleGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService,
    private readonly mediaService: MediaService,
    private readonly jwtGuard: JwtGuard,
  ) {}

  // Create a post with status "draft"
  @Post('draft')
  @UseInterceptors(FilesInterceptor('files', 10))
  @Role('schoolAdmin')
  async createDraft(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
    @UploadedFiles() files: Express.Multer.File[],
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
    let media = [];
    if (files && files.length > 0) {
      media = await this.mediaService.uploadMedia(files, userId);
    }

    const newDraft = await this.postService.createDraft(createPostDto, userId);
    for (const mediaItem of media) {
      await this.postService.associateMediaWithPost(newDraft.id, mediaItem.id);
    }
    return {...newDraft, media};
  }

  // Fetch posts by school ID derived from user ID
  @Get('all-posts')
  async getPostsBySchoolId(
    @Headers('authorization') authHeader: string
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const {userId} = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    const schoolId = await this.postService.getSchoolIdForUser(userId);
    const posts = await this.postService.getPostsBySchoolId(schoolId);
    return posts;
  }
  // Update post (both draft and published)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('newFiles', 10))
  @Role('schoolAdmin')
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
    @UploadedFiles() newFiles?: Express.Multer.File[],
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
    const updatedPost = await this.postService.updatePost(postId, updatePostDto, newFiles, userId);
    return updatedPost;
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

  @Delete(':id')
  async deletePost(
    @Param('id') postId: number,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      await this.postService.deletePost(postId);
      return { message: 'Post, related media, comments, likes, hashtags, and classes deleted successfully' };
    } catch (err) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}

