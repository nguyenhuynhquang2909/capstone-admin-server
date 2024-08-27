import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  teacherId?: number;

  @IsOptional()
  @IsNumber()
  locationId?: number;

  @IsOptional()
  @IsString()
  schoolYear?: string;
}
