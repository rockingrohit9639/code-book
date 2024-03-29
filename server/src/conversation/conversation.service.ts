import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Conversation } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateConversationDto } from './conversation.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { CONVERSATION_INCLUDE_FIELDS } from './conversation.fields'

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getExistingConversation(userId: string, users: string[]): Promise<Conversation | null> {
    /** Conversation exists if current user created it and other users are in users array of conversation
     * Or, one of the users created the conversation and current user is in the users array of conversation
     */
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        OR: [
          { AND: [{ createdById: userId }, { userIds: { hasSome: users } }] },
          { AND: [{ createdById: { in: users } }, { userIds: { hasSome: userId } }] },
        ],
      },
    })

    if (!conversation) {
      return null
    }

    return conversation
  }

  async createConversation(dto: CreateConversationDto, user: UserWithoutSensitiveData): Promise<Conversation> {
    /** If there is an already created conversation, we will not create another conversation  */
    const conversation = await this.getExistingConversation(user.id, dto.users)
    if (conversation) {
      return conversation
    }

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
      where: { OR: [{ createdById: user.id }, { userIds: { has: user.id } }] },
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

  async checkIsConversationValidForUser(id: string, user: UserWithoutSensitiveData): Promise<boolean> {
    const conversation = await this.findOneById(id)

    /** Conversation is only valid to a user if he/she has created it or he/she is in the users array of conversation */
    if (conversation.createdById === user.id || conversation.userIds.includes(user.id)) {
      return true
    }

    return false
  }
}
