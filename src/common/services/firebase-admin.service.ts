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

      // Log the response in a readable format
      this.logger.log(`Successfully sent message.`);

      // Check if there are any results to report
      if (response.failureCount > 0) {
        this.logger.warn('Some messages failed to send.');
        response.results.forEach((result, index) => {
          if (result.error) {
            this.logger.error(
              `Error sending message to token ${deviceTokens[index]}: ${result.error.message}`,
            );
          }
        });
      }
    } catch (error) {
      this.logger.error('Error sending message:', error);
    }
  }
}
