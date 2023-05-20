export type UserWithoutSensitiveData = Omit<User, 'password' | 'salt'>

export type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  mobile?: number
  username: string
  gender?: string
  bio?: string
  dob?: string
  website?: string
  github?: string
  linkedin?: string
  password: string
  salt: string
  createdAt: string
  updatedAt: string
  followers: User[]
  followerIds: string[]
  following: User[]
  followingIds: string[]
}
