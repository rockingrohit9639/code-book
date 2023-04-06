import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common'
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

  @Patch(':id')
  updateUserProfile(@Param('id') id: string, @Body() dto: UpdateUserProfileDto): Promise<UserWithoutSensitiveData> {
    return this.userService.updateUserProfile(id, dto)
  }
}
