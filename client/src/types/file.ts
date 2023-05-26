import { User } from './user'

export type FileType = {
  id: string
  encoding: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  createdBy: User
  createdById: string
}
