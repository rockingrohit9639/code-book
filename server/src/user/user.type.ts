import { User } from '@prisma/client'

export type UserWithoutSensitiveData = Omit<User, 'password' | 'salt'>
