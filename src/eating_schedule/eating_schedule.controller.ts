import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EatingScheduleService } from './eating_schedule.service';
import { CreateEatingScheduleDto } from './dto/create-eating_schedule.dto';
import { UpdateEatingScheduleDto } from './dto/update-eating_schedule.dto';

@Controller('eating-schedule')
export class EatingScheduleController {
  constructor(private readonly eatingScheduleService: EatingScheduleService) {}

  @Post()
  create(@Body() createEatingScheduleDto: CreateEatingScheduleDto) {
    return this.eatingScheduleService.create(createEatingScheduleDto);
  }

  @Get()
  findAll() {
    return this.eatingScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eatingScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEatingScheduleDto: UpdateEatingScheduleDto,
  ) {
    return this.eatingScheduleService.update(+id, updateEatingScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eatingScheduleService.remove(+id);
  }
}
