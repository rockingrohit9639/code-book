import { Module } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { FileModule } from '~/file/file.module'
import { NotificationModule } from '~/notification/notification.module'

@Module({
  imports: [FileModule, NotificationModule],
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [PostService],
})
export class PostModule {}
