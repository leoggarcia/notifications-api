import { Injectable } from '@nestjs/common';
import { NotificationsChannel } from './notification-channel.interface';

@Injectable()
export class PushChannel implements NotificationsChannel {
  async send({ user, subject, description }) {
    console.log(`🔥 Push to ${user.id}: ${subject}`);
  }
}
