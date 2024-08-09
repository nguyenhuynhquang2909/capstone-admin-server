import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    @IsNotEmpty()
    @IsString()
    subject: string;
}