import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express/multer';

import { PostService } from './post.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePostDto } from './dto/create-post.dto';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post()
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(2)
  // async create(@Req() request: any, @Body() createPostDto: CreatePostDto) {
  //   const {id: userId } = request.user;
  //   return this.postService.create(userId, createPostDto);
  // }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() request: any) {
    const { id } = request.user;
    return this.postService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Req() request: any, @Param('id') id: string) {
    const { id: userId } = request.user;
    return this.postService.findOne(userId, +id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Req() request: any, @Param('id') postId: string) {
    const { id: userId } = request.user;
    return this.postService.toggleLike(userId, +postId);
  }

  @Post(':id/comment')
  @UseGuards(AuthGuard('jwt'))
  async commentPost(
    @Req() request: any,
    @Param('id') postId: string,
    @Body() body: any,
  ) {
    const { id: userId } = request.user;
    const { content } = body;
    return this.postService.commentPost(userId, +postId, content);
  }

  @Delete(':postId/comment/:commentId/delete')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(
    @Req() request: any,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    const { id: userId } = request.user;
    return this.postService.deleteComment(userId, +postId, +commentId);
  }

  @Put(':postId/comment/:commentId/edit')
  @UseGuards(AuthGuard('jwt'))
  async editComment(
    @Req() request: any,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: any,
  ) {
    const { id: userId } = request.user;
    const { content } = body;
    return this.postService.editComment(userId, +postId, +commentId, content);
  }

  @Post(':id/images')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 30))
  async uploadImages(
    @Req() request: any,
    @Param('id') postId: string,
    @UploadedFiles() images: any,
  ) {
    const { id: userId } = request.user;
    return this.postService.uploadImages(userId, +postId, images);
  }
}
