import { Injectable } from '@nestjs/common';
// import { CreateEatingScheduleDto } from './dto/create-eating_schedule.dto';
// import { UpdateEatingScheduleDto } from './dto/update-eating_schedule.dto';

@Injectable()
export class EatingScheduleService {
  // @typescript-eslint/no-unused-vars
  create() {
    return 'This action adds a new eatingSchedule';
  }

  findAll() {
    return `This action returns all eatingSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eatingSchedule`;
  }

  update(id: number) {
    return `This action updates a #${id} eatingSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} eatingSchedule`;
  }
}
