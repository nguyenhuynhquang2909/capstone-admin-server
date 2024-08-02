import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  media_type: string;

}
