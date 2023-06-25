import { User } from './user'

export type Conversation = {
  id: string
  createdAt: string
  updatedAt: string
  isGroup: boolean
  users: User[]
  userIds: string[]
  createdBy: User
  createdById: string
}

export type CreateConversationDto = {
  isGroup?: boolean
  users: string[]
}
