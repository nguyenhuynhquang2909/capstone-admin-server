import { Controller, Get, Body } from '@nestjs/common';
import { EatingScheduleService } from './eating_schedule.service';
import { CreateEatingScheduleDto } from './dto/create-eating_schedule.dto';

@Controller('eating-schedule')
export class EatingScheduleController {
  constructor(private readonly eatingScheduleService: EatingScheduleService) {}

  @Get()
  async findAll(@Body() body: CreateEatingScheduleDto) {
    const { startDate, endDate } = body;
    return this.eatingScheduleService.findByDateRange(startDate, endDate);
  }
}
