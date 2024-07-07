import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AbsenceStatus } from "src/common/enum/absence_status.enum";
import { AbsenceType } from "src/common/enum/absence_type.enum";
import { IsTodayOrFutureDate } from "src/common/decorators/is-today-or-future-date.decorator";

export class CreateAbsenceDto {
    @IsOptional()
    @IsEnum(AbsenceStatus)
    absence_status: string; 

    @IsNotEmpty()
    @IsEnum(AbsenceType)
    absence_type: string; 

    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @IsTodayOrFutureDate()  
    start_time: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    end_time: Date

}   