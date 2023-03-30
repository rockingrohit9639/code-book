import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './auth.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    return this.authService.login(loginDto)
  }

  @Post('signup')
  async createUser(@Body() createUserDto: SignupDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    return this.authService.signup(createUserDto)
  }
}
