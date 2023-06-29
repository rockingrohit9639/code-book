import {
  IsDateString,
  IsEmail,
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

  @IsString({ each: true })
  tags: string[]
}

export class SearchUserDto {
  @IsString()
  query: string
}
