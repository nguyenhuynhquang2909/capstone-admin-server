import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(
      '',
      '',
    );
  }

  async sendOTP(phone: string, otp: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: '+...',
        to: '+84' + phone,
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }
}
