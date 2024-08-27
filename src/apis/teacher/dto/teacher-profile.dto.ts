import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

class ClassDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    location_name: string;

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

    @IsString()
    profilePictureUrl: string;

   @IsArray()
    @ValidateNested({each: true})
    @Type(() => ClassDto)
    classes: ClassDto[];

    
}