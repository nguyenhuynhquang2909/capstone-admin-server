import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class ClassDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    class_room: string;

    @IsString()
    school_year: string;
}

export class TeacherProfileDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    contact_number: string;

    @IsString()
    school_name: string;

   @IsArray()
    @ValidateNested({each: true})
    @Type(() => ClassDto)
    classes: ClassDto[];
}