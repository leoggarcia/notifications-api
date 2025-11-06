import { Injectable } from '@nestjs/common';
import { EmailChannel } from './email.channel';
import { PushChannel } from './push.channel';
import { SmsChannel } from './sms.channel';

@Injectable()
export class NotificationChannelFactory {
  constructor(
    private emailChannel: EmailChannel,
    private smsChannel: SmsChannel,
    private pushChannel: PushChannel,
  ) {}

  getChannel(type: string) {
    switch (type) {
      case 'email':
        return this.emailChannel;
      case 'sms':
        return this.smsChannel;
      case 'push':
        return this.pushChannel;
      default:
        return null;
    }
  }
}
