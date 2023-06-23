import { Post } from './post'
import { User } from './user'

export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'POST_UPLOAD'

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
  type: NotificationType
}
