import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { Message } from '@prisma/client'
import { MessageService } from './message.service'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':conversationId')
  getConversationMessages(
    @Param('conversationId') conversationId: string,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<Message[]> {
    return this.messageService.getConversationMessage(conversationId, user)
  }
}
