import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

// Common
import { JwtService } from '../../common/jwt/jwt.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getNotifications(@Headers('authorization') authHeader: string) {
    this.verifyAuthHeader(authHeader);
    const userId = this.getUserIdFromToken(authHeader);

    return this.notificationService.getNotifications(userId);
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
