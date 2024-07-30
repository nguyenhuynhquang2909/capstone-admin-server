import {
  Controller,
  Get,
  Post as PostMethod,
  Patch,
  Delete,
  Headers,
  Param,
  Body,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtService } from '../../common/jwt/jwt.service';

// DTOs
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async findPosts(@Headers('authorization') authHeader: string) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    return this.postService.findPostsForUser(userId);
  }

  @Get(':id')
  async findPostById(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    const post = await this.postService.findPostByIdForUser(userId, id);
    if (!post) {
      throw new NotFoundException('Post not found or not accessible.');
    }

    return post;
  }

  @PostMethod(':id/like')
  async toggleLike(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    try {
      const result = await this.postService.toggleLikeForPost(userId, id);
      return { message: result };
    } catch (e) {
      this.handleServiceException(e);
    }
  }

  @PostMethod(':id/comment')
  async addComment(
    @Headers('authorization') authHeader: string,
    @Param('id') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    if (!createCommentDto.content) {
      throw new BadRequestException('Comment content is required');
    }

    try {
      const comment = await this.postService.addCommentToPost(
        userId,
        postId,
        createCommentDto.content,
      );
      return comment;
    } catch (e) {
      this.handleServiceException(e);
    }
  }

  @Patch(':postId/comment/:commentId')
  async editComment(
    @Headers('authorization') authHeader: string,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    if (!updateCommentDto.content) {
      throw new BadRequestException('Comment content is required');
    }

    try {
      const comment = await this.postService.editComment(
        userId,
        commentId,
        updateCommentDto.content,
      );
      return comment;
    } catch (e) {
      this.handleServiceException(e);
    }
  }

  @Delete(':postId/comment/:commentId')
  async deleteComment(
    @Headers('authorization') authHeader: string,
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    try {
      const message = await this.postService.deleteComment(userId, commentId);
      return { message };
    } catch (e) {
      this.handleServiceException(e);
    }
  }

  private verifyAuthHeader(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
  }

  private getUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = this.jwtService.verifyToken(token);
      return decodedToken.userId;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private handleServiceException(e: Error) {
    if (e instanceof NotFoundException) {
      throw new NotFoundException(e.message);
    } else if (e instanceof ConflictException) {
      throw new ConflictException(e.message);
    }
    throw e;
  }
}
