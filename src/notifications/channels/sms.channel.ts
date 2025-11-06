import { Injectable } from '@nestjs/common';
import { NotificationsChannel } from './notification-channel.interface';

@Injectable()
export class SmsChannel implements NotificationsChannel {
  async send({ user, subject, description }) {
    console.log(`📩 SMS to ${user.phone}: ${subject}`);
  }
}
