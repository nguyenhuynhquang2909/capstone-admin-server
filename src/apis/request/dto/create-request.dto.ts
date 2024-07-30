import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  request_type: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  note: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  start_time: Date;

  @IsNotEmpty()
  @IsDateString()
  end_time: Date;
}
