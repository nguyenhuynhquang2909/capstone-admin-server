import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtService } from '../../common/jwt/jwt.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const media = await this.mediaService.uploadMedia(files, userId);
    return media;
  }
}
