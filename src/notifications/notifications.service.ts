import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
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
    const notification = await this.notificationsRepository.findOneBy({
      id: id,
    });

    if (notification?.id !== userId) {
      return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return this.notificationsRepository.softRemove(notification);
  }
}
