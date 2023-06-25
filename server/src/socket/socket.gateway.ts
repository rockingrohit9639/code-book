import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server
  private logger: Logger = new Logger('SocketGateway')

  afterInit() {
    this.logger.log('Initialized Socket Gateway!')
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    const globalRoom = `/global/${room}`
    if (!client.rooms.has(globalRoom)) {
      client.join(globalRoom)
      this.logger.log(`Client ${client.id} joined room ${globalRoom}`)
    }
  }
}
