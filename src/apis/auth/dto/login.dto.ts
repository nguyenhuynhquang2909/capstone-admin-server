import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,20}$/, {
    message:
      'Phone number must be between 10 and 20 digits and contain only numbers',
  })
  phone: string;
}
