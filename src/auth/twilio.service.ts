import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(
      'AC9c2aa4377c682a6376d66a4cf82ab357',
      '886a2298e67f15747d323ed0371c7b12',
    );
  }

  async sendOTP(phone: string, otp: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: '+12679150254',
        to: '+84' + phone,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }
}
