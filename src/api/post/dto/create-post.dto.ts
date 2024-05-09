// import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

// export class CreatePostDto {
//   @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
//   @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
//   title: string;

//   @IsNotEmpty({ message: 'Nội dung không được để trống' })
//   @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
//   content: string;

//   @IsNotEmpty({ message: 'ID trường học không được để trống' })
//   @IsNumber({}, { message: 'ID trường học phải là số' })
//   school_id: number;

//   @IsNotEmpty({ message: 'ID người dùng không được để trống' })
//   @IsNumber({}, { message: 'ID người dùng phải là số' })
//   user_id: number;

//   @IsOptional()
//   published_at: Date;
// }
