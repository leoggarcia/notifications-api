import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        phone: 1234567890,
      };
      const hashedPassword = 'hashedPassword';
      const user = { id: 1, ...createUserDto, password: hashedPassword };

      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const { password, ...result } = user;
      const response = await service.create(createUserDto);

      expect(response).toEqual(result);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        phone: 1234567890,
      };
      const user = { id: 1, ...createUserDto };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      const response = await service.create(createUserDto);

      expect(response).toBeInstanceOf(HttpException);
      expect((response as HttpException).getStatus()).toBe(
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const { password, ...result } = user;
      const response = await service.findOne(1);

      expect(response).toEqual(result);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const response = await service.findOne(1);

      expect(response).toBeInstanceOf(HttpException);
      expect((response as HttpException).getStatus()).toBe(
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const response = await service.findOneByEmail('test@example.com');

      expect(response).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const response = await service.findOneByEmail('test@example.com');

      expect(response).toBeInstanceOf(HttpException);
      expect((response as HttpException).getStatus()).toBe(
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const user = {
        id: 1,
        name: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };
      const updatedUser = { ...user, ...updateUserDto };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockUserRepository.merge.mockReturnValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const response = await service.update(1, updateUserDto);

      expect(response).toEqual(updatedUser);
    });

    it('should return error if user to update is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

      const response = await service.update(1, updateUserDto);
      expect(response).toBeInstanceOf(HttpException);
      expect((response as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const user = { id: 1, name: 'Test' };
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockUserRepository.softRemove.mockResolvedValue(undefined);

      const response = await service.remove(1);

      expect(response).toEqual({ message: 'User deleted' });
      expect(mockUserRepository.softRemove).toHaveBeenCalledWith(user);
    });

    it('should throw an error if user to remove is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const response = await service.remove(1);

      expect(response).toBeInstanceOf(HttpException);
      expect((response as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
