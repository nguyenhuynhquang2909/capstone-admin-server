import { IsNotEmpty, IsNumber, isString, IsString } from "class-validator";

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

}


