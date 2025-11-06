import { User } from 'src/users/entities/user.entity';

export interface NotificationsChannel {
  send(data: {
    user: User;
    subject: string;
    description: string;
  }): Promise<void>;
}
