import { IsNotEmpty, IsPhoneNumber, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsInt({ message: 'ID của vai trò phải là một số nguyên' })
  role_id: number;
}
