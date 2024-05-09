import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHashtagDto {
  @IsNotEmpty({ message: 'Thẻ không được để trống' })
  @IsString({ message: 'Thẻ phải là một chuỗi' })
  @MaxLength(50, { message: 'Thẻ không được vượt quá 50 ký tự' })
  tag: string;
}
