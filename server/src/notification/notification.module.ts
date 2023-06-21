import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { PrismaService } from '~/prisma/prisma.service'
import { NotificationGateway } from './notification.gateway'

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
