import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userWithEmail = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (userWithEmail) {
      return new HttpException(
        `User with email "${createUserDto.email}" already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...userWithOutPass } = user;

    return userWithOutPass;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (user instanceof HttpException) {
      return user;
    }

    const updated = this.usersRepository.merge(user as User, updateUserDto);
    return this.usersRepository.save(updated);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id: id });

    if (!user) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    this.usersRepository.remove(user);

    return {
      message: 'User deleted',
    };
  }
}
