import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FcmService {
  private readonly messaging: admin.messaging.Messaging;

  constructor() {
    const firebaseConfig = {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    };

    admin.initializeApp(firebaseConfig);

    this.messaging = admin.messaging();
  }

  async sendPushNotification(deviceTokens: string[], payload: admin.messaging.Message) {
    if (!deviceTokens || deviceTokens.length === 0) {
      console.error('No device tokens available to send the notification.');
      throw new Error('No device tokens available to send the notification.');
    }

    try {
      const response = await this.messaging.sendMulticast({
        ...payload,
        tokens: deviceTokens,
      });
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
