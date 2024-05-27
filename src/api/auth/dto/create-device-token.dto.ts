import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @IsNotEmpty()
  @IsString()
  readonly device_type: string;
}
