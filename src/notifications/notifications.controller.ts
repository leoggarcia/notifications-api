import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser() user,
  ) {
    return this.notificationsService.create(user.sub, createNotificationDto);
  }

  @Get()
  findAll(@GetUser() user) {
    return this.notificationsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.notificationsService.findOne(+id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @GetUser() user,
  ) {
    return this.notificationsService.update(
      +id,
      updateNotificationDto,
      user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user) {
    return this.notificationsService.remove(+id, user.sub);
  }
}
