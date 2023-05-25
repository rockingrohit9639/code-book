import { PartialType, PickType } from '@nestjs/mapped-types'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title: string

  @IsString()
  codeSnippet: string

  /** base64 string containing the image */
  @IsString()
  imageBase64: string
}

export class UpdatePostDto extends PartialType(PickType(CreatePostDto, ['title'])) {}
