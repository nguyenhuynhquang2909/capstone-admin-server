import { Controller, Get, Body } from '@nestjs/common';
import { ClassScheduleService } from './class_schedule.service';
import { CreateClassScheduleDto } from './dto/create-class_schedule.dto';

@Controller('class-schedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Get()
  async findAll(@Body() body: CreateClassScheduleDto) {
    const { startDate, endDate } = body;
    return this.classScheduleService.findByDateRange(startDate, endDate);
  }
}
