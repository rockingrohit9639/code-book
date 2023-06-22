import { Module } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { NotificationModule } from '~/notification/notification.module'

@Module({
  imports: [NotificationModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
