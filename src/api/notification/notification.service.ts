import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from '../../common/entities/device-token.entity';
import * as admin from 'firebase-admin';
import { PushNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async getUserDeviceTokens(userId: number): Promise<string[]> {
    const tokens = await this.deviceTokenRepository
      .createQueryBuilder('deviceToken')
      .select('deviceToken.token')
      .where('deviceToken.user_id = :userId', { userId })
      .getMany();

    return tokens.map(token => token.token);
  }
  
  async sendPushNotification(deviceTokens: string[], payload: PushNotificationDto) {
    const message: admin.messaging.MulticastMessage = {
      tokens: deviceTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      android: {
        // Additional Android configuration if needed
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: payload.title,
              body: payload.body,
            },
          },
        },
      },
      data: {
        // Additional data to send along with the notification payload
        // Example: customKey: 'customValue'
      },
    };

    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send push notification');
    }
  }
}
