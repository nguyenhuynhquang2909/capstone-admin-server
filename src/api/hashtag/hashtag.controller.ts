import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  async create(@Body() createHashtagDto: CreateHashtagDto) {
    return await this.hashtagService.create(createHashtagDto);
  }

  @Get()
  async findAll() {
    return await this.hashtagService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hashtagService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.hashtagService.remove(+id);
  }
}
