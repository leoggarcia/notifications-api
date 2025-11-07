import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;

  const mockNotificationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { sub: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call notificationsService.create with correct parameters', () => {
      const createNotificationDto: CreateNotificationDto = {
        subject: 'Test message',
        description: 'Test message',
        notification_type: 'sms',
        scheduled_date: new Date(),
      };
      controller.create(createNotificationDto, mockUser);
      expect(service.create).toHaveBeenCalledWith(
        mockUser.sub,
        createNotificationDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call notificationsService.findAll with correct user id', () => {
      controller.findAll(mockUser);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.sub);
    });
  });

  describe('findOne', () => {
    it('should call notificationsService.findOne with correct parameters', () => {
      const id = '1';
      controller.findOne(id, mockUser);
      expect(service.findOne).toHaveBeenCalledWith(+id, mockUser.sub);
    });
  });

  describe('update', () => {
    it('should call notificationsService.update with correct parameters', () => {
      const id = '1';
      const updateNotificationDto: UpdateNotificationDto = {
        description: 'Updated message',
      };
      controller.update(id, updateNotificationDto, mockUser);
      expect(service.update).toHaveBeenCalledWith(
        +id,
        updateNotificationDto,
        mockUser.sub,
      );
    });
  });

  describe('remove', () => {
    it('should call notificationsService.remove with correct parameters', () => {
      const id = '1';
      controller.remove(id, mockUser);
      expect(service.remove).toHaveBeenCalledWith(+id, mockUser.sub);
    });
  });
});
