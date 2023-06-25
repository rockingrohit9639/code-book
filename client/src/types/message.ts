import { Conversation } from './conversation'
import { User } from './user'

export type Message = {
  id: string
  createdAt: string
  updatedAt: string
  content: string
  seen: boolean
  delivered: boolean
  conversation: Conversation
  conversationId: string
  from: User
  fromId: string
  recipient?: User
  recipientId?: string
}
