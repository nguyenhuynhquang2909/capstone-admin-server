import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDailyScheduleDto {
  @IsNumber()
  @IsOptional()
  class_id?: number;

  @IsNumber()
  @IsOptional()
  teacher_id?: number;

  @IsNumber()
  @IsOptional()
  subject_id?: number;

  @IsNumber()
  @IsOptional()
  location_id?: number;

  @IsDateString()
  @IsOptional()
  start_time?: Date;

  @IsDateString()
  @IsOptional()
  end_time?: Date;
}
