import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { PASSWORD_REGEX } from '~/constants/constants'

export class LoginDto {
  @IsString()
  usernameOrEmail: string

  @IsString()
  password: string
}

export class SignupDto {
  @IsEmail()
  @Transform((obj) => obj.value.toLowerCase())
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
  @Transform((obj) => obj.value.toLowerCase())
  username: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(10000_00000)
  @Max(99999_99999)
  mobile?: number

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(PASSWORD_REGEX, { message: 'Password is too weak' })
  password: string
}

export class LinkWithGoogleDto {
  @IsString()
  access_token: string
}

export class LoginWithGoogleDto {
  @IsString()
  accessToken: string
}

export class CreateGoogleUserDto {
  @IsEmail()
  email: string

  @IsString()
  name: string

  @IsUrl()
  picture: string

  @IsString()
  given_name: string

  @IsOptional()
  @IsString()
  family_name?: string
}
