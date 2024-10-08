import { IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends CreatePostDto {
  @IsOptional()
  newFiles?: Express.Multer.File[];
}
