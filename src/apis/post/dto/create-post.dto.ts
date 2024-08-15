import { IsString, IsIn, IsOptional, IsArray } from 'class-validator';

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
  
  @IsArray()
  @IsOptional()
  classIds?: number[];
}
