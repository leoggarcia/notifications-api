import { Injectable } from '@nestjs/common';
import { NotificationsChannel } from './notification-channel.interface';
import { SmsService } from '../../sms/sms.service';

@Injectable()
export class SmsChannel implements NotificationsChannel {
  constructor(private smsService: SmsService) {}

  async send({ user, subject, description }) {
    try {
      this.smsService.createSMS(description, user.phone);

      console.log(`📩 SMS to ${user.phone}: ${subject}`);
    } catch (e) {
      console.error(e);
    }
  }
}
