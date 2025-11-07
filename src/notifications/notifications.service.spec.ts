import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getQueueToken } from '@nestjs/bullmq';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Queue } from 'bullmq';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationQueue: Queue;
  let notificationsRepository: Repository<Notification>;
  let usersService: UsersService;

  const mockQueue = {
    add: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getQueueToken('notifications'), useValue: mockQueue },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockRepository,
        },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notificationQueue = module.get<Queue>(getQueueToken('notifications'));
    notificationsRepository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification and add it to the queue', async () => {
      const userId = 1;
      const createNotificationDto: CreateNotificationDto = {
        subject: 'Test message',
        description: 'Test message',
        notification_type: 'sms',
        scheduled_date: new Date(),
      };
      const user: Omit<User, 'password'> = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: 1234567890,
        notifications: [],
        isActive: true,
        created_at: new Date(),
        deleted_at: new Date(),
        updated_at: new Date()
      };
      const notification = { ...createNotificationDto, user, id: 1 };

      mockUsersService.findOne.mockResolvedValue(user);
      mockRepository.create.mockReturnValue(notification);
      mockRepository.save.mockResolvedValue(notification);
      mockQueue.add.mockResolvedValue(undefined);

      const result = await service.create(userId, createNotificationDto);

      expect(result).toEqual(notification);
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(notificationsRepository.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        user,
      });
      expect(notificationsRepository.save).toHaveBeenCalledWith(notification);
      expect(notificationQueue.add).toHaveBeenCalled();
    });

    it('should return HttpException if user not found', async () => {
      const userId = 1;
      const createNotificationDto: CreateNotificationDto = {
        subject: 'Test message',
        description: 'Test message',
        notification_type: 'sms',
        scheduled_date: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );

      const result = await service.create(userId, createNotificationDto);
      expect(result).toBeInstanceOf(HttpException);
      expect((result as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('findAll', () => {
    it('should return an array of notifications', async () => {
      const userId = 1;
      const notifications = [{ id: 1 }, { id: 2 }];
      mockRepository.find.mockResolvedValue(notifications);

      const result = await service.findAll(userId);

      expect(result).toEqual(notifications);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
    });
  });

  describe('findOne', () => {
    it('should return an array with one notification', async () => {
      const userId = 1;
      const notificationId = 1;
      const notification = [{ id: 1 }];
      mockRepository.find.mockResolvedValue(notification);

      const result = await service.findOne(notificationId, userId);

      expect(result).toEqual(notification);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { id: notificationId, user: { id: userId } },
      });
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      const userId = 1;
      const notificationId = 1;
      const notification = { id: 1 };
      mockRepository.findOne.mockResolvedValue(notification);
      mockRepository.softRemove.mockResolvedValue(notification);

      await service.remove(notificationId, userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: notificationId, user: { id: userId } },
        relations: { user: true },
      });
      expect(mockRepository.softRemove).toHaveBeenCalledWith(notification);
    });

    it('should return HttpException if notification not found', async () => {
      const userId = 1;
      const notificationId = 1;
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.remove(notificationId, userId);
      expect(result).toBeInstanceOf(HttpException);
      expect((result as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
