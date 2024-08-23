import { IsOptional, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  teacherId?: number;

  @IsOptional()
  @IsString()
  classRoom?: string;

  @IsOptional()
  @IsString()
  schoolYear?: string;
}
