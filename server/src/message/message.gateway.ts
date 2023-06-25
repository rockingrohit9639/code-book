import { Logger } from '@nestjs/common'
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { CreateMessageDto } from './message.dto'
import { MessageService } from './message.service'

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server
  private logger: Logger = new Logger('MessageGateway')

  constructor(private readonly messageService: MessageService) {}

  afterInit() {
    this.logger.log('Initialized Message Gateway!')
  }

  @SubscribeMessage('message')
  async handleNewMessage(client: Socket, payload: CreateMessageDto) {
    const newMessage = await this.messageService.createMessage(payload)

    const to = [newMessage.conversation.createdById, ...newMessage.conversation.userIds].filter(
      (id) => id !== payload.from,
    )

    if (to.length) {
      client.to(to).emit('message', newMessage)
    }
  }
}
