import { User } from '@prisma/client'

export type UserWithoutSensitiveData = Omit<User, 'password' | 'salt'>

export type BasicUser = Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>
