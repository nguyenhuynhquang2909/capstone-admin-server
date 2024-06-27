import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PushNotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('push')
  async sendPushNotification(@Body() payload: PushNotificationDto) {
    const userId = 3;
    const deviceTokens =
      await this.notificationService.getUserDeviceTokens(userId);

    if (deviceTokens.length === 0) {
      throw new Error('No device tokens available to send the notification.');
    }

    await this.notificationService.sendPushNotification(deviceTokens, payload);
  }
}
