import { IsNotEmpty, IsNumberString, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @IsNumberString({}, { message: 'Mã OTP phải là một chuỗi số' })
  otp: string;
}
