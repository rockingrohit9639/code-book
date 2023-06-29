import { Module } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { NotificationModule } from '~/notification/notification.module'
import { PostModule } from '~/post/post.module'

@Module({
  imports: [NotificationModule, PostModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
