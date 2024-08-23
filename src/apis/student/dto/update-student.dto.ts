import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  studentName?: string;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsString()
  @IsOptional()
  parentPhone?: string;
}
