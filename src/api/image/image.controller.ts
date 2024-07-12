import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ImageService } from './image.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('student')
  @UseGuards(AuthGuard('jwt'))
  async findAllStudentImages(@Req() request: any) {
    const { id: userId } = request.user;
    return this.imageService.findAll(userId);
  }
}
