import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationChannelFactory } from './channels/notification-channel.factory';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(
    private notificationService: NotificationsService,
    private notificationChannelFactory: NotificationChannelFactory,
  ) {
    super();
  }

  async process(job: Job) {
    const { notification, user } = job.data;

    const sendFunction = this.notificationChannelFactory.getChannel(
      notification.notification_type,
    );

    await sendFunction?.send({
      user,
      subject: notification.subject,
      description: notification.description,
    });

    // REMOVE THE NOTIFICATION
    await this.notificationService.remove(notification.id, user.id);
  }
}
