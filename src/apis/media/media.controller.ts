import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

// Common
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';

// Decorators
import { Role } from '../../common/decorators/role.decorator';

@UseGuards(JwtGuard, RoleGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly jwtGuard: JwtGuard,
  ) {}

  @Post('upload')
  @Role('schoolAdmin')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtGuard.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const media = await this.mediaService.uploadMedia(files, userId);
    return media;
  }
}
