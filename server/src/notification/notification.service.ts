import { Injectable } from '@nestjs/common'
import { Notification } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { NOTIFICATION_INCLUDE_FIELDS } from './notification.fields'

@Injectable()
export class NotificationService {
  constructor(private readonly prismaService: PrismaService) {}

  createNotification(by: string, to: string, content: string): Promise<Notification> {
    return this.prismaService.notification.create({
      data: {
        notificationToId: to,
        notificationById: by,
        content,
      },
      include: NOTIFICATION_INCLUDE_FIELDS,
    })
  }
}
