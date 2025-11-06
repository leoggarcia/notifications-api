import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  scheduled_date: Date;
  
  @IsString()
  @IsNotEmpty()
  notification_type: string
}
