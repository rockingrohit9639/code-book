import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LinkOrLoginWithGithubDto, LinkOrLoginWithGoogleDto, LoginDto, SignupDto } from './auth.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from './jwt/jwt.guard'
import { GetUser } from './user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Post('link-with-github')
  async linkAccountWithGithub(
    @Body() dto: LinkOrLoginWithGithubDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.authService.linkAccountWithGithub(dto, user)
  }

  @Post('login-with-github')
  async loginWithGithub(
    @Body() dto: LinkOrLoginWithGithubDto,
  ): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    return this.authService.loginWithGithub(dto)
  }

  @UseGuards(JwtGuard)
  @Post('link-with-google')
  async linkAccountWithGoogle(
    @Body() dto: LinkOrLoginWithGoogleDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    return this.authService.linkAccountWithGoogle(dto, user)
  }

  @Post('login-with-google')
  async loginWithGoogle(@Body() dto: LinkOrLoginWithGoogleDto) {
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
