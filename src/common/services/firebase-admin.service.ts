import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  private readonly logger = new Logger(FirebaseAdminService.name);

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }

  async sendPushNotification(
    deviceTokens: string[],
    message: admin.messaging.MessagingPayload,
  ): Promise<void> {
    try {
      const response = await admin
        .messaging()
        .sendToDevice(deviceTokens, message);
      this.logger.log(`Successfully sent message: ${response}`);
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }
}
