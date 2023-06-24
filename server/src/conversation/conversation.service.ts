import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Conversation } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateConversationDto } from './conversation.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { CONVERSATION_INCLUDE_FIELDS } from './conversation.fields'

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  createConversation(dto: CreateConversationDto, user: UserWithoutSensitiveData): Promise<Conversation> {
    return this.prismaService.conversation.create({
      data: {
        createdBy: { connect: { id: user.id } },
        users: { connect: dto.users.map((id) => ({ id })) },
        isGroup: dto.isGroup,
      },
      include: CONVERSATION_INCLUDE_FIELDS,
    })
  }

  getUserConversations(user: UserWithoutSensitiveData): Promise<Conversation[]> {
    return this.prismaService.conversation.findMany({
      where: { users: { some: { id: user.id } } },
      include: CONVERSATION_INCLUDE_FIELDS,
    })
  }

  async findOneById(id: string): Promise<Conversation> {
    const conversation = await this.prismaService.conversation.findFirst({ where: { id } })
    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }
    return conversation
  }

  async deleteConversation(id: string, user: UserWithoutSensitiveData): Promise<Conversation> {
    const conversation = await this.findOneById(id)
    if (conversation.createdById !== user.id) {
      throw new UnauthorizedException('You are not allowed to delete this conversation!')
    }
    return this.prismaService.conversation.delete({ where: { id } })
  }
}
