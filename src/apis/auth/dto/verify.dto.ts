import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,20}$/, {
    message:
      'Phone number must be between 10 and 20 digits and contain only numbers',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, {
    message: 'OTP must be a 6-digit number',
  })
  otp: string;
}
