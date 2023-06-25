import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Message } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { CreateMessageDto } from './message.dto'
import { MESSAGE_INCLUDE_FIELDS } from './message.fields'
import { ConversationService } from '~/conversation/conversation.service'

@Injectable()
export class MessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly conversationService: ConversationService,
  ) {}

  createMessage(dto: CreateMessageDto, user: UserWithoutSensitiveData): Promise<Message> {
    return this.prismaService.message.create({
      data: {
        content: dto.content,
        conversationId: dto.conversation,
        fromId: user.id,
        delivered: true,
        recipientId: dto.recipient,
      },
      include: MESSAGE_INCLUDE_FIELDS,
    })
  }

  async getConversationMessage(conversationId: string, user: UserWithoutSensitiveData): Promise<Message[]> {
    const isConversationValid = await this.conversationService.checkIsConversationValidForUser(conversationId, user)

    if (!isConversationValid) {
      throw new UnauthorizedException('You are not allowed to view messages of this conversation!')
    }

    return this.prismaService.message.findMany({ where: { conversationId }, include: MESSAGE_INCLUDE_FIELDS })
  }
}
