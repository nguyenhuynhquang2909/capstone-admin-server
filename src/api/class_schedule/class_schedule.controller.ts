import {
  Controller,
  Get,
  Post,
  // Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassScheduleService } from './class_schedule.service';
// import { CreateClassScheduleDto } from './dto/create-class_schedule.dto';
// import { UpdateClassScheduleDto } from './dto/update-class_schedule.dto';

@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Post()
  create() {
    return this.classScheduleService.create();
  }

  @Get()
  findAll() {
    return this.classScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    // @Body() updateClassScheduleDto: UpdateClassScheduleDto,
  ) {
    return this.classScheduleService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classScheduleService.remove(+id);
  }
}
