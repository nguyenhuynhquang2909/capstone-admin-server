import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from '../../common/entities/device-token.entity';
import * as admin from 'firebase-admin';

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
  
  async sendPushNotification(deviceTokens: string[], payload: any) {
    if (!deviceTokens || deviceTokens.length === 0) {
      console.error('No device tokens available to send the notification.');
      throw new Error('No device tokens available to send the notification.');
    }
  
    // Convert values to strings
    const dataPayload = {
      Nick: String(payload.nick),
      Room: String(payload.room),
    };
  
    const message: admin.messaging.MulticastMessage = {
      tokens: deviceTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: dataPayload,
      android: {},
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
    };
  
    try {
      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
