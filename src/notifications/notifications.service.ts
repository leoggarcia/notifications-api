import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UsersService } from 'src/users/users.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private userService: UsersService,
  ) {}

  async create(userId: number, createNotificationDto: CreateNotificationDto) {
    const user = await this.userService.findOne(userId);

    if (user instanceof HttpException) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newNotification = this.notificationsRepository.create({
      ...createNotificationDto,
      user: user,
    });

    const savesNotification =
      await this.notificationsRepository.save(newNotification);

    // ADD NOTIFICATION TO THE QUEUE
    await this.scheduleReminder(savesNotification, user);

    return savesNotification;
  }

  async findAll(userId: number) {
    const notifications = await this.notificationsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return notifications;
  }

  async findOne(id: number, userId: number) {
    const notifications = await this.notificationsRepository.find({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    return notifications;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
    userId: number,
  ) {
    const notification = await this.notificationsRepository.findOneBy({
      id: id,
    });

    if (notification?.id !== userId) {
      return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    const updated = this.notificationsRepository.merge(
      notification,
      updateNotificationDto,
    );
    return this.notificationsRepository.save(updated);
  }

  async remove(id: number, userId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!notification) {
      console.error('Notification not found');
      return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return this.notificationsRepository.softRemove(notification);
  }

  async scheduleReminder(
    notification: Notification,
    user: Omit<User, 'password'>,
  ) {
    const delay = notification.scheduled_date.getTime() - Date.now();

    await this.notificationQueue.add(
      'send-notification',
      {
        notification,
        user,
      },
      { delay, attempts: 3 },
    );
  }
}
