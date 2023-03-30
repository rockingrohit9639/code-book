import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { omit } from 'lodash'
import { UserService } from '~/user/user.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { LoginDto } from './auth.dto'
import { JwtPayload } from './jwt/jwt.type'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const user = await this.userService.validateUser(dto.email, dto.password)
    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)
    return {
      user,
      token,
    }
  }

  async validatePayload(payload: JwtPayload): Promise<UserWithoutSensitiveData> {
    const user = await this.userService.findOneByEmail(payload.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return omit(user, 'password', 'salt')
  }
}
