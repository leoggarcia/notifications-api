import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { NotificationsProcessor } from './notifications.processor';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from '../mail/mail.module';
import { EmailChannel } from './channels/email.channel';
import { NotificationChannelFactory } from './channels/notification-channel.factory';
import { SmsChannel } from './channels/sms.channel';
import { PushChannel } from './channels/push.channel';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule,
    MailModule,
    SmsModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    NotificationChannelFactory,
    EmailChannel,
    SmsChannel,
    PushChannel,
  ],
})
export class NotificationsModule {}
