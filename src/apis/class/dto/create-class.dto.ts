import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  teacherId: number;

  @IsNotEmpty()
  @IsString()
  classRoom: string;

  @IsNotEmpty()
  @IsString()
  schoolYear: string;
}
