import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsOptional()
  @IsIn(['draft', 'published'])
  @IsOptional()
  status: string;
}
