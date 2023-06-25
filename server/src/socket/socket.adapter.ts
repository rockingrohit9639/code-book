import { IncomingMessage } from 'http'
import { INestApplicationContext } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions, Socket } from 'socket.io'
import { JwtPayload } from '~/auth/jwt/jwt.type'
import { UserService } from '~/user/user.service'
import { BasicUser, UserWithoutSensitiveData } from '~/user/user.type'

/**
 * Adapter to manage authentication by validation jwt payload in every socket io request
 */
export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService
  private readonly configService: ConfigService
  private readonly userService: UserService

  constructor(private readonly app: INestApplicationContext) {
    super(app)
    this.jwtService = app.get(JwtService)
    this.configService = app.get(ConfigService)
    this.userService = app.get(UserService)
  }

  createIOServer(port: number, options: ServerOptions) {
    /** Only allow the request if the headers contain Bearer token */
    options.allowRequest = async (request: IncomingMessage & { user: UserWithoutSensitiveData }, allowFunction) => {
      const authenticationHeader = request.headers.authorization?.split(' ') ?? []
      const [tokenKey, bearerToken] = authenticationHeader

      if (tokenKey !== 'Bearer') {
        return allowFunction('Invalid token key!', false)
      }

      if (!bearerToken) {
        return allowFunction('Invalid Token!', false)
      }

      return allowFunction(null, true)
    }

    const server = super.createIOServer(port, options)

    /** Validate token using jwt and assign user property in socket instance */
    server.use(async (socket: Socket & { user: BasicUser }, next: (err?: any) => void) => {
      try {
        const bearerToken = socket.handshake.headers.authorization?.split(' ')[1]

        if (!bearerToken) {
          return next('Unauthorized access!')
        }

        try {
          const payload = this.jwtService.verify(bearerToken, this.configService.get('JWT_SECRET')) as JwtPayload
          if (!payload) {
            return next('Unauthorized access!')
          }
          const user = await this.userService.findBasicUserById(payload.id)

          if (!user) {
            return next('Unauthorized access!')
          }

          socket.user = user

          return next()
        } catch (error) {
          return next('Unauthorized access!')
        }
      } catch (err) {
        return next(err)
      }
    })

    return server
  }
}
