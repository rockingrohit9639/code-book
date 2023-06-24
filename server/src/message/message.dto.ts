import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class CreateMessageDto {
  @IsString()
  content: string

  @IsMongoId()
  conversation: string

  @IsOptional()
  @IsMongoId()
  recipient: string
}
