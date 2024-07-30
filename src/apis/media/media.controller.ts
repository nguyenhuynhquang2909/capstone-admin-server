import {
  Controller,
  Get,
  Headers,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { MediaService } from './media.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getMedia(@Headers('authorization') authHeader: string) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    return this.mediaService.getMedia(userId);
  }

  @Get(':id')
  async getStudentMedia(
    @Headers('authorization') authHeader: string,
    @Param('id') studentId: number,
  ) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    return this.mediaService.getStudentMedia(userId, studentId);
  }

  private verifyAuthHeader(authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
  }

  private getUserIdFromToken(authHeader: string): number {
    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = this.jwtService.verifyToken(token);
      return decodedToken.userId;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
