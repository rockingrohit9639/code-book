import { Logger } from '@nestjs/common'
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { CreateMessageDto } from './message.dto'
import { MessageService } from './message.service'
import { SocketWithUser } from '~/socket/socket.gateway'

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server
  private logger: Logger = new Logger('MessageGateway')

  constructor(private readonly messageService: MessageService) {}

  afterInit() {
    this.logger.log('Initialized Message Gateway!')
  }

  @SubscribeMessage('message')
  async handleNewMessage(client: SocketWithUser, payload: CreateMessageDto) {
    const newMessage = await this.messageService.createMessage(payload)
    client.to(payload.conversation).emit('message', newMessage)
    client.to(payload.conversation).emit('typing-stop')
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(client: Socket, conversationId: string) {
    client.join(conversationId)
    this.logger.log(`Client ${client.id} joined conversation ${conversationId}`)
  }

  @SubscribeMessage('typingStart')
  handleTypingStart(client: SocketWithUser, conversationId: string) {
    client.to(conversationId).emit('typing-start', client.user)
  }
}
