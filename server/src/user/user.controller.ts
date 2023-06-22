import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserWithoutSensitiveData } from './user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { SearchUserDto, UpdateUserProfileDto } from './user.dto'

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/search')
  searchUsers(
    @Query() dto: SearchUserDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData[]> {
    return this.userService.searchUsers(dto, user)
  }

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
  @Post('follow/:userId')
  follow(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    return this.userService.follow(userId, currentUser)
  }

  @Post('unfollow/:userId')
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
