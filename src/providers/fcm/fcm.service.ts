import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private readonly messaging: admin.messaging.Messaging;

  constructor() {
    const firebaseConfig = {
      credential: admin.credential.applicationDefault(),
    };

    admin.initializeApp(firebaseConfig);

    this.messaging = admin.messaging();
  }

  async sendPushNotification(deviceTokens: string[], payload: admin.messaging.Message) {
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

