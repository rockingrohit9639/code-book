import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserWithoutSensitiveData } from './user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { UpdateUserProfileDto } from './user.dto'

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  findMe(@GetUser() user: UserWithoutSensitiveData): UserWithoutSensitiveData {
    return user
  }

  @Get()
  findAll(): Promise<UserWithoutSensitiveData[]> {
    return this.userService.findAll()
  }

  @Get(':username')
  findOneById(@Param('username') username: string): Promise<UserWithoutSensitiveData> {
    return this.userService.findOneByUsername(username)
  }

  @Patch(':id')
  updateUserProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserProfileDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.userService.updateUserProfile(id, dto, user)
  }

  /** Followers and Followings */
  @Post('/followers/:userId')
  follow(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    return this.userService.follow(userId, currentUser)
  }

  @Post('followers/unfollow/:userId')
  unfollow(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    return this.userService.unfollow(userId, currentUser)
  }

  @Delete('followers/:userId')
  removeFollower(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.userService.removeFollower(userId, currentUser)
  }
}
