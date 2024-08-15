import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DeviceToken } from '../entities/device-token.entity';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async sendNotification(
    userIds: number[],
    notificationData: {
      title: string;
      body: string;
      navigationId: string;
      additionalData?: any;
    },
  ): Promise<void> {
    const deviceTokens = await this.getDeviceTokensForUsers(userIds);

    if (deviceTokens.length === 0) return;

    const dataPayload = {
      navigationId: notificationData.navigationId,
      ...Object.keys(notificationData.additionalData || {}).reduce(
        (acc, key) => {
          acc[key] = String(notificationData.additionalData[key]);
          return acc;
        },
        {},
      ),
    };

    console.log('Notification Data:', notificationData);
    console.log('Data Payload:', dataPayload);

    const message = {
      notification: {
        title: notificationData.title,
        body: notificationData.body,
      },
      data: dataPayload,
    };

    await this.firebaseAdminService.sendPushNotification(deviceTokens, message);
  }

  private async getDeviceTokensForUsers(userIds: number[]): Promise<string[]> {
    const tokens = await this.deviceTokenRepository.find({
      where: { user_id: In(userIds) },
    });

    return tokens.map((token) => token.token);
  }
}
