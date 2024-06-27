import { PartialType } from '@nestjs/mapped-types';
import { CreateEatingScheduleDto } from './create-eating_schedule.dto';

export class UpdateEatingScheduleDto extends PartialType(
  CreateEatingScheduleDto,
) {}
