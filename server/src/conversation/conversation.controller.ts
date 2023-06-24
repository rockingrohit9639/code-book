import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Conversation } from '@prisma/client'
import { ConversationService } from './conversation.service'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { CreateConversationDto } from './conversation.dto'

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  createConversation(
    @Body() dto: CreateConversationDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<Conversation> {
    return this.conversationService.createConversation(dto, user)
  }

  @Get()
  getUserConversations(@GetUser() user: UserWithoutSensitiveData): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(user)
  }

  @Delete(':id')
  deleteConversation(@Param('id') id: string, @GetUser() user: UserWithoutSensitiveData): Promise<Conversation> {
    return this.conversationService.deleteConversation(id, user)
  }
}
