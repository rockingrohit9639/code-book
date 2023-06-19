import { Post } from './post'
import { User } from './user'

export type Notification = {
  id: string
  notificationBy: User
  notificationById: string
  notificationTo: User
  notificationToId: string
  content: string
  isRead: boolean
  post?: Post
  postId?: string
  createdAt: string
  updatedAt: string
}
