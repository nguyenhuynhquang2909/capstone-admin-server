// src/apis/media/dto/create-media.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  media_type: string;

  @IsNumber()
  @IsNotEmpty()
  school_id: number;
}
