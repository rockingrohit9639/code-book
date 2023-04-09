import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserWithoutSensitiveData } from './user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { UpdateUserProfileDto } from './user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findMe(@GetUser() user: UserWithoutSensitiveData): UserWithoutSensitiveData {
    return user
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<UserWithoutSensitiveData[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<UserWithoutSensitiveData> {
    return this.userService.findOneById(id)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateUserProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserProfileDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.userService.updateUserProfile(id, dto, user)
  }

  /**
   * Followers and Followings
   */
  @UseGuards(JwtGuard)
  @Post('/followers/:userId')
  follow(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    return this.userService.follow(userId, currentUser)
  }

  @UseGuards(JwtGuard)
  @Post('followers/unfollow/:userId')
  unfollow(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<[UserWithoutSensitiveData, UserWithoutSensitiveData]> {
    return this.userService.unfollow(userId, currentUser)
  }

  @UseGuards(JwtGuard)
  @Delete('followers/:userId')
  removeFollower(
    @Param('userId') userId: string,
    @GetUser() currentUser: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.userService.removeFollower(userId, currentUser)
  }
}
