import { IsNotEmpty, IsNumberString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}
