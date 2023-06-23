import { Injectable } from '@nestjs/common'
import { Notification, NotificationType } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { NOTIFICATION_INCLUDE_FIELDS } from './notification.fields'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { SocketGateway } from '../socket/socket.gateway'

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService, private readonly socketGateway: SocketGateway) {}

  async createNotification(
    by: string,
    to: string[],
    content: string,
    type: NotificationType,
    postId?: string,
  ): Promise<Notification> {
    const notification = await this.prismaService.notification.create({
      data: {
        notificationToIds: to,
        notificationById: by,
        content,
        postId,
        type,
      },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })

    this.socketGateway.wss.volatile.to(to.map((t) => `/global/${t}`)).emit('notification', notification)
    return notification
  }

  getUserNotifications(user: UserWithoutSensitiveData): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: { notificationToIds: { has: user.id } },
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
