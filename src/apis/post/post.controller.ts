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
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { error } from 'console';

// Services
import { JwtService } from '../../common/jwt/jwt.service';
import { PostService } from './post.service';
import { MediaService } from '../media/media.service';

// DTOs
import { CreatePostDto } from './dto/create-post.dto';

// Guard
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('post')
@UseGuards(JwtGuard, RoleGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService,
    private readonly mediaService: MediaService,
  ) {}

  // Create a post with status "draft"
  @Post('draft')
  @UseInterceptors(FilesInterceptor('media', 10, {
    limits: {fileSize: 1 * 1024  * 1024 * 1024}
  }))
  @Role('schoolAdmin')
  async createDraft(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
    @UploadedFiles() media: Express.Multer.File[],
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
    let mediaItems = [];
    if (media && media.length > 0) {
      mediaItems = await this.mediaService.uploadMedia(media, userId);
    }

    const newDraft = await this.postService.createDraft(createPostDto, userId);
    for (const mediaItem of mediaItems) {
      await this.postService.associateMediaWithPost(newDraft.id, mediaItem.id);
    }
    return { ...newDraft, media: mediaItems };
  }

  // Fetch posts by school ID derived from user ID
  @Get('all-posts')
  @Role('schoolAdmin')
  async getPostsBySchoolId(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    const schoolId = await this.postService.getSchoolIdForUser(userId);
    const posts = await this.postService.getPostsBySchoolId(schoolId);
    return posts;
  }

  // Update post (both draft and published)
  @Put(':id')
  @UseInterceptors(FilesInterceptor('newFiles', 10, {
    limits: {fileSize: 1 * 1024 * 1024 * 1024}
  }))
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
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const updatedPost = await this.postService.updatePost(
      postId,
      updatePostDto,
      newFiles,
      userId,
    );
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
    const decodedToken = this.jwtService.verifyToken(token);

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
  @Role('schoolAdmin')
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
      return {
        message:
          'Post, related media, comments, likes, hashtags, and classes deleted successfully',
      };
    } catch (err) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
