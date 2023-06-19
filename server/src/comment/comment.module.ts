import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { PrismaService } from '~/prisma/prisma.service'
import { NotificationModule } from '~/notification/notification.module'
import { PostModule } from '~/post/post.module'

@Module({
  imports: [PostModule, NotificationModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
  exports: [CommentService],
})
export class CommentModule {}
