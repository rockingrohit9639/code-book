import { Module } from '@nestjs/common'
import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'
import { PrismaService } from '~/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService],
})
export class ConversationModule {}
