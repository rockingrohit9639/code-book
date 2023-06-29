import { Post } from './post'

export type UserWithoutSensitiveData = Omit<User, 'password' | 'salt'>

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  mobile?: number
  username: string
  bio?: string
  dob?: string
  website?: string
  github?: string
  linkedin?: string
  password: string
  salt: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  followers: User[]
  followerIds: string[]
  following: User[]
  followingIds: string[]
  posts: Post[]
  postIds: string[]
  savedPosts: Post[]
  savedPostIds: string[]
}

export type UpdateProfileDto = Partial<
  Pick<User, 'firstName' | 'lastName' | 'bio' | 'dob' | 'website' | 'github' | 'linkedin' | 'email'>
>

export type BasicUser = Pick<User, 'id' | 'email' | 'username' | 'firstName' | 'lastName'>
