import { IsNotEmpty, IsDateString } from 'class-validator';

export class GetScheduleDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
