import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'
import { PrismaService } from '~/prisma/prisma.service'
import { PostModule } from '~/post/post.module'
import { NotificationModule } from '~/notification/notification.module'

@Module({
  imports: [PostModule, NotificationModule],
  controllers: [LikeController],
  providers: [LikeService, PrismaService],
  exports: [LikeService],
})
export class LikeModule {}
