import { IsDateString } from 'class-validator';

export class CreateEatingScheduleDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
