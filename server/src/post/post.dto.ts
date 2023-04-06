import { PartialType, PickType } from '@nestjs/mapped-types'
import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  title: string

  @IsMongoId()
  image: string

  @IsString()
  codeSnippet: string
}

export class UpdatePostDto extends PartialType(PickType(CreatePostDto, ['title'])) {}
