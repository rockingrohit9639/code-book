import { IsString } from 'class-validator'

export class CreateTagDto {
  @IsString()
  tag: string
}
