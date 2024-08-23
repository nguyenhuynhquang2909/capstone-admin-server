import { IsNotEmpty, IsString } from "class-validator";

export class CreateTeacherDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    contact_number: string;
}