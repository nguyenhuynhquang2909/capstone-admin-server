import { IsOptional, IsString } from "class-validator";

export class UpdateTeacherDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    contact_number?: string;
}