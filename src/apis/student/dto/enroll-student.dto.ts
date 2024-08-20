import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";

export class EnrollStudentDto {
   @IsString()
    @IsNotEmpty()
    studentName: string;

    @IsString()
    @IsNotEmpty()
    dateOfBirth: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender;

    @IsString()
    @IsNotEmpty()
    parentName: string;

    @IsString()
    @IsNotEmpty()
    parentPhone: string;
}