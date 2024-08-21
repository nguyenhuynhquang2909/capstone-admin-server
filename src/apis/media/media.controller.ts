import {
  Controller,
  Post,
  Get,
  Headers,
  UseInterceptors,
  UploadedFiles,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtService } from '../../common/jwt/jwt.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Role } from 'src/common/decorators/role.decorator';

@Controller('media')
@UseGuards(JwtGuard, RoleGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
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
    const decodedToken = this.jwtService.verifyToken(token);

    const { userId } = decodedToken;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const media = await this.mediaService.uploadMedia(files, userId);
    return media;
  }

  @Get()
  @Role('schoolAdmin')
  async getMediaByUser(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const media = await this.mediaService.getMediaByUser(userId);
    return media;
  }
}
