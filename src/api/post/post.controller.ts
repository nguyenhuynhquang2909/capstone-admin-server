import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

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
}
