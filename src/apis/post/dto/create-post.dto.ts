import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsIn(['draft', 'published'])
  @IsNotEmpty()
  status: string;
}
