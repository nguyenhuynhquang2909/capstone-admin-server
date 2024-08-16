import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEatingScheduleDto {
    @IsNumber()
    @IsNotEmpty()
    class_id: number;

    @IsDateString()
    @IsNotEmpty()
    start_time: Date;

    @IsDateString()
    @IsNotEmpty()
    end_time: Date;

    @IsString()
    @IsNotEmpty()
    meal: string;
    
    @IsArray()
    @IsNotEmpty()
    menu: string[];

    @IsArray()
    @IsNotEmpty()
    nutrition: string[];

    @IsNumber()
    @IsNotEmpty()
    location_id: number;


}