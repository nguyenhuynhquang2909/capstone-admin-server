import { IsNotEmpty, IsPhoneNumber, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là một chuỗi' })
  name: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsString({ message: 'Email phải là một chuỗi' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là một chuỗi' })
  password: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsInt({ message: 'ID của vai trò phải là một số nguyên' })
  role_id: number;
}
