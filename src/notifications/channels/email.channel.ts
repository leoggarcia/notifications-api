import { MailService } from 'src/mail/mail.service';
import { NotificationsChannel } from './notification-channel.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailChannel implements NotificationsChannel {
  constructor(private mailService: MailService) {}

  async send({ user, subject, description }) {
    await this.mailService.sendEmail(user.email, subject, description);

    console.log(`📧 Email to ${user.email}: ${subject}`);
  }
}
