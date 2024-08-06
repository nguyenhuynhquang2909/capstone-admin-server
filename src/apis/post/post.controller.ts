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
} from '@nestjs/common';
import { JwtService } from '../../common/jwt/jwt.service';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { MediaService } from '../media/media.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService,
    private readonly mediaService: MediaService 
  ) {}

  // Create a post with status "draft"
  @Post('draft')
  @UseInterceptors(FilesInterceptor('files', 10))
  async createDraft(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
    @UploadedFiles() files: Express.Multer.File[],
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

  // Update post (both draft and published)
  @Put(':id')
  async updatePost(
    @Param('id') postId: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
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
      const updatedPost = await this.postService.updatePost(postId, updatePostDto);
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
}

