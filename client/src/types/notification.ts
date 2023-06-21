import { Post } from './post'
import { User } from './user'

export type Notification = {
  id: string
  notificationBy: User
  notificationById: string
  notificationTo: User[]
  notificationToIds: string[]
  content: string
  isRead: boolean
  post?: Post
  postId?: string
  createdAt: string
  updatedAt: string
}
