import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with the correct dto', () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        phone: 1234567890,
      };
      controller.create(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should call usersService.findOne with the correct id', () => {
      const id = '1';
      controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call usersService.update with the correct id and dto', () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };
      controller.update(id, updateUserDto);
      expect(service.update).toHaveBeenCalledWith(+id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with the correct id', () => {
      const id = '1';
      controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
