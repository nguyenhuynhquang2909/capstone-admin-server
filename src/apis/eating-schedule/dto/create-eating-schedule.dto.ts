import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateEatingScheduleDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  class_id: number;

  @IsDateString()
  @IsNotEmpty()
  start_time: Date;

  @IsDateString()
  @IsNotEmpty()
  end_time: Date;

  @IsString()
  @IsNotEmpty()
  meal: string;

  @IsArray()
  @IsNotEmpty()
  menu: string[];

  @IsArray()
  @IsNotEmpty()
  nutrition: string[];

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  location_id: number;
}
