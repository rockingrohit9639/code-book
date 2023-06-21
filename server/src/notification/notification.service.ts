import { Injectable } from '@nestjs/common'
import { Notification } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { NOTIFICATION_INCLUDE_FIELDS } from './notification.fields'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { NotificationGateway } from './notification.gateway'

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(by: string, to: string, content: string, postId?: string): Promise<Notification> {
    const notification = await this.prismaService.notification.create({
      data: {
        notificationToId: to,
        notificationById: by,
        content,
        postId,
      },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })

    this.notificationGateway.wss.to(`notification/${to}`).emit('notification', notification)
    return notification
  }

  getUserNotifications(user: UserWithoutSensitiveData): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: { notificationTo: { id: user.id } },
      orderBy: { createdAt: 'desc' },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })
  }

  markAsRead(id: string): Promise<Notification> {
    return this.prismaService.notification.update({
      where: { id },
      data: { isRead: true },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })
  }
}
