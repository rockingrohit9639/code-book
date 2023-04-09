import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from './user.type'
import { SignupDto } from '~/auth/auth.dto'
import { USER_SELECT_FIELDS } from './user.fields'
import { UpdateUserProfileDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<UserWithoutSensitiveData[]> {
    return this.prismaService.user.findMany({
      where: { role: { not: 'ADMIN' } },
      select: USER_SELECT_FIELDS,
    })
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

  async updateUserProfile(
    id: string,
    dto: UpdateUserProfileDto,
    user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    const existedUser = await this.findOneById(id)
    if (existedUser.id !== user.id) {
      throw new ForbiddenException('You are not allowed to update this profile!')
    }

    return this.prismaService.user.update({
      where: { id: user.id },
      data: dto,
      select: USER_SELECT_FIELDS,
    })
  }

  private sanitizeUser(user: User): UserWithoutSensitiveData {
    return omit(user, 'password', 'salt')
  }

  /**
   * Followers and Followings
   */

  async follow(
    userId: string,
    currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    const user = await this.findOneById(userId)

    const [updatedUser, updatedCurrentUser] = await Promise.all([
      this.prismaService.user.update({
        where: { id: user.id },
        data: { followers: { connect: { id: currentUser.id } } },
        select: USER_SELECT_FIELDS,
      }),
      this.prismaService.user.update({
        where: { id: currentUser.id },
        data: { following: { connect: { id: user.id } } },
        select: USER_SELECT_FIELDS,
      }),
    ])

    return [updatedUser, updatedCurrentUser]
  }

  async unfollow(
    userId: string,
    currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    const user = await this.findOneById(userId)

    const [updatedUser, updatedCurrentUser] = await Promise.all([
      this.prismaService.user.update({
        where: { id: user.id },
        data: { followers: { disconnect: { id: currentUser.id } } },
        select: USER_SELECT_FIELDS,
      }),
      this.prismaService.user.update({
        where: { id: currentUser.id },
        data: { following: { disconnect: { id: user.id } } },
        select: USER_SELECT_FIELDS,
      }),
    ])

    return [updatedUser, updatedCurrentUser]
  }

  async removeFollower(userId: string, currentUser: UserWithoutSensitiveData): Promise<UserWithoutSensitiveData> {
    const user = await this.findOneById(userId)

    return this.prismaService.user.update({
      where: { id: currentUser.id },
      data: { followers: { disconnect: { id: user.id } } },
      select: USER_SELECT_FIELDS,
    })
  }
}
