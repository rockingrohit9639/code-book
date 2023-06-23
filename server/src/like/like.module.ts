import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'
import { PrismaService } from '~/prisma/prisma.service'
import { NotificationModule } from '~/notification/notification.module'
import { SocketModule } from '~/socket/socket.module'

@Module({
  imports: [NotificationModule, SocketModule],
  controllers: [LikeController],
  providers: [LikeService, PrismaService],
  exports: [LikeService],
})
export class LikeModule {}
