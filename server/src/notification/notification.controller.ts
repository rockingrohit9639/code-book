import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { Notification } from '@prisma/client'
import { NotificationService } from './notification.service'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getUserNotifications(@GetUser() user: UserWithoutSensitiveData): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(user)
  }

  @Patch('mark-as-read/:id')
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.markAsRead(id)
  }
}
