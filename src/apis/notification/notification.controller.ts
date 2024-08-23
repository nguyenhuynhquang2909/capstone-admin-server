// src/apis/notification/notification.controller.ts
import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtService } from '../../common/jwt/jwt.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';

@Controller('notification')
@UseGuards(JwtGuard, RoleGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Role('schoolAdmin')
  async getNotifications(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = this.jwtService.verifyToken(token);
    const { userId } = decodedToken;

    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const notifications = await this.notificationService.getNotificationsForUser(userId);
    return notifications;
  }

  @Post()
  @Role('schoolAdmin')
  async sendNotification(
    @Body() createNotificationDto: CreateNotificationDto,
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

    await this.notificationService.sendNotificationToSchoolParents(userId, createNotificationDto);
    return { message: 'Notification sent successfully' };
  }
}
