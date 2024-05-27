import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PushNotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('push')
  async sendPushNotification(@Body() notification: PushNotificationDto) {
    const userId = 1;
    const deviceTokens = await this.notificationService.getUserDeviceTokens(userId);
    await this.notificationService.sendPushNotification(deviceTokens, notification);
    return { success: true };
  }
}
