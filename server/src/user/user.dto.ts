import { Gender } from '@prisma/client'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UpdateUserProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName?: string

  @IsOptional()
  @IsMobilePhone('en-IN')
  mobile?: number

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  bio?: string

  @IsOptional()
  @IsDateString()
  dob?: string

  @IsOptional()
  @IsUrl()
  website?: string

  @IsOptional()
  @IsUrl()
  github?: string

  @IsOptional()
  @IsUrl()
  linkedin?: string
}
