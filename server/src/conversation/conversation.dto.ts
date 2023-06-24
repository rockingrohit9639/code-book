import { IsBoolean, IsMongoId, IsOptional } from 'class-validator'

export class CreateConversationDto {
  @IsMongoId({ each: true })
  users: string[]

  @IsOptional()
  @IsBoolean()
  isGroup: boolean
}
