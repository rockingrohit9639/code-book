import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, LoginWithGoogleDto, SignupDto } from './auth.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // : Promise<{ user: UserWithoutSensitiveData; token: string }>
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
