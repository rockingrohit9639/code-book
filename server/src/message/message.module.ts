import { Module } from '@nestjs/common'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'
import { PrismaService } from '~/prisma/prisma.service'
import { ConversationModule } from '~/conversation/conversation.module'
import { MessageGateway } from './message.gateway'

@Module({
  imports: [ConversationModule],
  controllers: [MessageController],
  providers: [MessageService, PrismaService, MessageGateway],
})
export class MessageModule {}
