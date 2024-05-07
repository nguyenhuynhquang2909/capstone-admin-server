import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateAuthDto {
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;
}
