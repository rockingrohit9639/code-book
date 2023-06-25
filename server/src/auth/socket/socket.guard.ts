import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'
import { WsException } from '@nestjs/websockets'
import { JwtPayload } from '../jwt/jwt.type'
import { EnvironmentVars } from '~/config/config.options'
import { PrismaService } from '~/prisma/prisma.service'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class SocketJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVars>,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket & { user: UserWithoutSensitiveData }>()
    const bearerToken = client.handshake.headers.authorization?.split(' ')[1]
    if (!bearerToken) {
      throw new WsException({ status: 401, message: 'Unauthorized access!' })
    }

    try {
      const payload = this.jwtService.verify(bearerToken, this.configService.get('JWT_SECRET')) as JwtPayload
      if (!payload) {
        throw new WsException({ status: 401, message: 'Unauthorized access!' })
      }
      const user = await this.prismaService.user.findFirst({
        where: { AND: [{ id: payload.id }, { email: payload.email }] },
        select: BASIC_USER_SELECT_FIELDS,
      })
      if (!user) {
        throw new WsException({ status: 401, message: 'Unauthorized access!' })
      }

      client.user = user as UserWithoutSensitiveData
      return true
    } catch (error) {
      throw new WsException({ status: 401, message: 'Unauthorized access!' })
    }
  }
}
