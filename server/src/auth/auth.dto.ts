import {
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'
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

export class SignupDto {
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(10)
  lastName?: string

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsMobilePhone('en-IN')
  mobile?: number

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(PASSWORD_REGEX, { message: 'Password is too weak' })
  password: string
}
