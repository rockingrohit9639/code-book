import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { PASSWORD_REGEX } from '~/constants/constants'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(PASSWORD_REGEX, { message: 'Password is too weak' })
  password: string
}
