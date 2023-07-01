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
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '~/prisma/prisma.service'
import { BasicUser, UserWithoutSensitiveData } from './user.type'
import { SignupDto } from '~/auth/auth.dto'
import { BASIC_USER_SELECT_FIELDS, USER_SELECT_FIELDS } from './user.fields'
import { SearchUserDto, UpdateUserProfileDto } from './user.dto'
import { POST_INCLUDE_FIELDS } from '~/post/post.fields'
import { NotificationService } from '~/notification/notification.service'
import { PostService } from '~/post/post.service'
import { EnvironmentVars } from '~/config/config.options'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly postsService: PostService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  searchUsers(dto: SearchUserDto, user: UserWithoutSensitiveData): Promise<UserWithoutSensitiveData[]> {
    return this.prismaService.user.findMany({
      where: {
        role: { not: 'ADMIN' },
        OR: [
          { username: { contains: dto.query } },
          { firstName: { contains: dto.query } },
          { lastName: { contains: dto.query } },
          { email: { contains: dto.query } },
        ],
        NOT: { id: user.id },
      },
    })
  }

  findAll(): Promise<UserWithoutSensitiveData[]> {
    return this.prismaService.user.findMany({
      where: { role: { not: 'ADMIN' } },
      select: USER_SELECT_FIELDS,
    })
  }

  async findOneById(id: string): Promise<UserWithoutSensitiveData> {
    const user = await this.prismaService.user.findFirst({ where: { id }, select: USER_SELECT_FIELDS })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async findBasicUserById(id: string): Promise<BasicUser | null> {
    return this.prismaService.user.findFirst({ where: { id }, select: BASIC_USER_SELECT_FIELDS })
  }

  /** Only basic information si required in socket.io adapter */
  async findOneByUsername(username: string): Promise<UserWithoutSensitiveData> {
    const user = await this.prismaService.user.findFirst({
      where: { username },
      select: { ...USER_SELECT_FIELDS, posts: { include: POST_INCLUDE_FIELDS } },
    })
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

  async validateUser(usernameOrEmail: string, password: string): Promise<UserWithoutSensitiveData> {
    let user: User | null

    user = await this.prismaService.user.findFirst({ where: { email: usernameOrEmail.trim() } })
    if (!user) {
      user = await this.prismaService.user.findFirst({ where: { username: usernameOrEmail.trim() } })
    }

    if (!user) {
      throw new NotFoundException(`User with email or username ${usernameOrEmail} not found!`)
    }

    const { password: userPassword, salt } = user

    if (!userPassword || !salt) {
      throw new UnauthorizedException('Invalid Credentials')
    }

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

  async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({ where: { username } })
    if (user) {
      return true
    }
    return false
  }

  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (user) {
      return true
    }
    return false
  }

  async savePost(
    postId: string,
    user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData & { status: 'SAVED' | 'REMOVED' }> {
    const post = await this.postsService.findOneById(postId)

    const isPostSaved = await this.prismaService.user.findFirst({
      where: { savedPosts: { some: { id: post.id } } },
      select: { id: true },
    })

    if (isPostSaved) {
      return {
        ...(await this.prismaService.user.update({
          where: { id: user.id },
          data: { savedPosts: { disconnect: { id: post.id } } },
          select: USER_SELECT_FIELDS,
        })),
        status: 'REMOVED',
      }
    }

    return {
      ...(await this.prismaService.user.update({
        where: { id: user.id },
        data: { savedPosts: { connect: { id: post.id } } },
        select: USER_SELECT_FIELDS,
      })),
      status: 'SAVED',
    }
  }

  async addGoogleSubInUser(userId: string, sub: string, picture?: string): Promise<UserWithoutSensitiveData> {
    return this.prismaService.user.update({ where: { id: userId }, data: { sub, picture }, select: USER_SELECT_FIELDS })
  }

  async findOneBySub(sub: string): Promise<UserWithoutSensitiveData | null> {
    return this.prismaService.user.findFirst({ where: { sub }, select: USER_SELECT_FIELDS })
  }

  async findOneByGithubUsername(username: string): Promise<UserWithoutSensitiveData | null> {
    return this.prismaService.user.findFirst({ where: { githubUsername: username }, select: USER_SELECT_FIELDS })
  }

  addGithubDataInUser(user: string, githubUsername: string, githubProfile: string): Promise<UserWithoutSensitiveData> {
    return this.prismaService.user.update({
      where: { id: user },
      data: { githubUsername, githubProfile },
      select: USER_SELECT_FIELDS,
    })
  }

  /** Followers and Followings */
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
      this.notificationService.createNotification(currentUser.id, [user.id], 'started following you.', 'FOLLOW'),
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
