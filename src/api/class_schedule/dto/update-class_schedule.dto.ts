import { PartialType } from '@nestjs/mapped-types';
import { CreateClassScheduleDto } from './create-class_schedule.dto';

export class UpdateClassScheduleDto extends PartialType(
  CreateClassScheduleDto,
) {}
