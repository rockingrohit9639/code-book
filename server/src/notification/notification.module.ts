import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { PrismaService } from '~/prisma/prisma.service'
import { SocketModule } from '~/socket/socket.module'

@Module({
  imports: [SocketModule],
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService],
  exports: [NotificationService],
})
export class NotificationModule {}
