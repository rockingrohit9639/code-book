import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class CreateMessageDto {
  @IsString()
  content: string

  @IsMongoId()
  conversation: string

  @IsMongoId()
  from: string

  @IsOptional()
  @IsMongoId()
  recipient: string
}
