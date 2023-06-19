import { Injectable } from '@nestjs/common'
import { Notification } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { NOTIFICATION_INCLUDE_FIELDS } from './notification.fields'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  createNotification(by: string, to: string, content: string, postId?: string): Promise<Notification> {
    return this.prismaService.notification.create({
      data: {
        notificationToId: to,
        notificationById: by,
        content,
        postId,
      },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })
  }

  getUserNotifications(user: UserWithoutSensitiveData): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: { notificationTo: { id: user.id } },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })
  }
}
