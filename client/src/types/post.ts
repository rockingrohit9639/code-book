import { FileType } from './file'
import { User } from './user'

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
}

export type CreatePostDto = Pick<Post, 'title' | 'codeSnippet'> & {
  imageBase64: string
}
