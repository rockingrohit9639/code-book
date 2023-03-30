import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from './user.type'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<User[]> {
    return this.prismaService.user.findMany()
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }
    return user
  }

  async validateUser(email: string, password: string): Promise<UserWithoutSensitiveData> {
    const user = await this.findOneByEmail(email)
    const { password: userPassword, salt } = user
    const hashedPassword = await bcrypt.hash(password, salt)
    if (userPassword !== hashedPassword) {
      throw new UnauthorizedException('Invalid Credentials')
    }
    return this.sanitizeUser(user)
  }

  private sanitizeUser(user: User): UserWithoutSensitiveData {
    return omit(user, 'password', 'salt')
  }
}
