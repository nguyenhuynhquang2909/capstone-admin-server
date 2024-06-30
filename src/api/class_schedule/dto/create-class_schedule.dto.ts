import { IsDateString } from 'class-validator';

export class CreateClassScheduleDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
