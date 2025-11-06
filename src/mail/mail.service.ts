import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, description: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      html: `
                <h1>¡Hola!</h1>
                <p>${description}</p>
            `,
    });
  }
}
