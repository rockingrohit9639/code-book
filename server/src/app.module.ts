import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { configOptions } from './config/config.options'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { PostModule } from './post/post.module'
import { LikeModule } from './like/like.module'
import { CommentModule } from './comment/comment.module'
import { NotificationModule } from './notification/notification.module'
import { SocketModule } from './socket/socket.module'
import { ConversationModule } from './conversation/conversation.module'
import { MessageModule } from './message/message.module'
import { TagModule } from './tag/tag.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(configOptions),
    UserModule,
    AuthModule,
    FileModule,
    PostModule,
    LikeModule,
    CommentModule,
    NotificationModule,
    SocketModule,
    ConversationModule,
    MessageModule,
    TagModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
