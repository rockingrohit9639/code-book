import { Injectable } from '@nestjs/common'
import { Message } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { CreateMessageDto } from './message.dto'
import { MESSAGE_INCLUDE_FIELDS } from './message.fields'

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
