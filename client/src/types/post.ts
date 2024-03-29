import { FileType } from './file'
import { User } from './user'

export type Like = {
  id: string
  likedBy: User
  likedById: string
  post: Post
  postId: string
  createdAt: string
  updatedAt: string
}

export type Comment = {
  id: string
  comment: string
  commentBy: User
  commentById: string
  post: Post
  postId: string
  createdAt: string
  updatedAt: string
}

export type Post = {
  id: string
  title: string
  codeSnippet: string
  image: FileType
  imageId: string
  createdBy: User
  createdById: string
  createdAt: string
  updatedAt: string
  views: number
  tags: string[]
  likes: Like[]
  comments: Comment[]
  isTrending?: boolean
}

export type CreatePostDto = Pick<Post, 'title' | 'codeSnippet' | 'tags'> & {
  imageBase64: string
}
