import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage } from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { JwtPayload } from '~/auth/jwt/jwt.type'

type SocketWithUser = Socket & { user: JwtPayload }

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server
  private logger: Logger = new Logger('SocketGateway')

  afterInit() {
    this.logger.log('Initialized Socket Gateway!')
  }

  handleDisconnect(client: SocketWithUser) {
    if (client.user) {
      client.leave(client.user.id)
      client.broadcast.emit('user-left', client.user)
    }
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: SocketWithUser, room: string) {
    if (!client.rooms.has(room)) {
      client.join(room)
      client.broadcast.emit('new-user', client.user)
    }
  }
}
