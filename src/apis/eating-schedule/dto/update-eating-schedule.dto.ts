import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';
export class UpdateEatingScheduleDto {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    class_id: number;

    @IsDateString()
    @IsOptional()
    start_time: Date;

    @IsDateString()
    @IsOptional()
    end_time: Date;

    @IsString()
    @IsOptional()
    meal: string;
    
    @IsArray()
    @IsOptional()
    menu: string[];

    @IsArray()
    @IsOptional()
    nutrition: string[];

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    location_id: number;
}