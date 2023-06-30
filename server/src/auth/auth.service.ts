import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { omit } from 'lodash'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { ConfigService } from '@nestjs/config'
import { UserService } from '~/user/user.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { LoginDto, LoginWithGoogleDto, SignupDto } from './auth.dto'
import { JwtPayload } from './jwt/jwt.type'
import { EnvironmentVars } from '~/config/config.options'
import { payloadSchema } from './auth.utils'

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {
    this.client = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'), configService.get('GOOGLE_CLIENT_SECRET'))
  }

  private getUsername(payload: TokenPayload): string {
    let username = payload.name?.replaceAll(' ', '_').toLowerCase()
    if (!username) {
      username = payload.email?.split('@')[0] ?? ''
    }

    return username
  }

  async loginWithGoogle(dto: LoginWithGoogleDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: dto.accessToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })
      const payload = ticket.getPayload()
      if (!payload) {
        throw new UnauthorizedException('Something went wrong while logging you in!')
      }
      const username = this.getUsername(payload)
      if (!username) {
        throw new ConflictException('Could not create username for this account, please try different one.')
      }

      const validPayload = payloadSchema.parse(payload)
      const user = await this.userService.findOrCreateGoogleUser(username, validPayload)
      const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
      const token = await this.jwtService.signAsync(jwtPayload)

      return {
        user,
        token,
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!')
    }
  }

  async validatePayload(payload: JwtPayload): Promise<UserWithoutSensitiveData> {
    const user = await this.userService.findOneByEmail(payload.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return omit(user, 'password', 'salt')
  }

  async login(dto: LoginDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const user = await this.userService.validateUser(dto.usernameOrEmail, dto.password)
    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)
    return {
      user,
      token,
    }
  }

  async signup(dto: SignupDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const user = await this.userService.createUser(dto)
    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)
    return {
      user,
      token,
    }
  }

  async isUsernameExists(username: string): Promise<boolean> {
    return this.userService.isUsernameExists(username)
  }

  async isEmailExists(email: string): Promise<boolean> {
    return this.userService.isEmailExists(email)
  }
}
