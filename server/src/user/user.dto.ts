import { Gender } from '@prisma/client'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
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
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(10000_00000)
  @Max(99999_99999)
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
