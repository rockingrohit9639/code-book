import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage } from '@nestjs/websockets'
import { Logger, UseGuards } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { SocketJwtGuard } from '~/auth/socket/socket.guard'
import { JwtPayload } from '~/auth/jwt/jwt.type'

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server
  private logger: Logger = new Logger('SocketGateway')

  afterInit() {
    this.logger.log('Initialized Socket Gateway!')
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket & { user: JwtPayload }, room: string) {
    if (!client.rooms.has(room)) {
      client.join(room)
      client.broadcast.emit('new-user', client.user)
    }
  }
}
