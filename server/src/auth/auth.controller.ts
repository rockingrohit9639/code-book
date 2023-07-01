import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LinkWithGoogleDto, LoginDto, LoginWithGoogleDto, SignupDto } from './auth.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from './jwt/jwt.guard'
import { GetUser } from './user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Post('link-with-google')
  async linkAccountWithGoogle(
    @Body() dto: LinkWithGoogleDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.authService.linkAccountWithGoogle(dto, user)
  }

  @Post('login-with-google')
  async loginWithGoogle(@Body() dto: LoginWithGoogleDto) {
    return this.authService.loginWithGoogle(dto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    return this.authService.login(loginDto)
  }

  @Post('signup')
  async createUser(@Body() createUserDto: SignupDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    return this.authService.signup(createUserDto)
  }

  @Get('username-exists')
  isUsernameExists(@Query('username') username: string) {
    return this.authService.isUsernameExists(username)
  }

  @Get('email-exists')
  isEmailExists(@Query('email') email: string) {
    return this.authService.isUsernameExists(email)
  }
}
