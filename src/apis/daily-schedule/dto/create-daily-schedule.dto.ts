import { IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateDailyScheduleDto {
    @IsNumber()
    @IsNotEmpty()
    class_id: number;

    @IsDateString()
    @IsNotEmpty()
    start_time: Date;

    @IsDateString()
    @IsNotEmpty()
    end_time: Date;

    @IsNumber()
    @IsNotEmpty()
    subject_id: number;

    @IsNumber()
    @IsNotEmpty()
    teacher_id: number;

    @IsNumber()
    @IsNotEmpty()
    location_id: number;
}