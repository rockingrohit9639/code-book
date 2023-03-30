import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from './user.type'
import { SignupDto } from '~/auth/auth.dto'
import { USER_SELECT_FIELDS } from './user.fields'

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

  async createUser(dto: SignupDto): Promise<UserWithoutSensitiveData> {
    const existedEmailUser = await this.prismaService.user.findFirst({ where: { email: dto.email } })
    if (existedEmailUser) {
      throw new BadRequestException(`User with email ${dto.email} already exists`)
    }

    const existedUsernameUser = await this.prismaService.user.findFirst({ where: { username: dto.username } })
    if (existedUsernameUser) {
      throw new BadRequestException(`User with username ${dto.username} already exists`)
    }

    const { password, ...restDto } = dto
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const data: Prisma.UserCreateInput = {
      email: restDto.email,
      username: restDto.username,
      password: hashedPassword,
      salt,
    }

    if (restDto?.firstName) {
      data.firstName = restDto.firstName
    }

    if (restDto?.lastName) {
      data.lastName = restDto.lastName
    }

    if (restDto?.mobile) {
      data.mobile = restDto.mobile
    }

    return this.prismaService.user.create({
      data,
      select: USER_SELECT_FIELDS,
    })
  }

  private sanitizeUser(user: User): UserWithoutSensitiveData {
    return omit(user, 'password', 'salt')
  }
}
