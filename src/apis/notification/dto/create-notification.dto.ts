import { IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;
  
  @IsOptional()
  additionalData?: string;
}
