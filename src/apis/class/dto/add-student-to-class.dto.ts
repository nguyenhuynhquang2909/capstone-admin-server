import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddStudentToClassDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;
}
