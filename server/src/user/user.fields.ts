import { Prisma } from '@prisma/client'

export const BASIC_USER_SELECT_FIELDS = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
} satisfies Prisma.UserSelect

export const USER_SELECT_FIELDS = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
  mobile: true,
  username: true,
  bio: true,
  dob: true,
  github: true,
  linkedin: true,
  website: true,
  createdAt: true,
  updatedAt: true,
  followers: true,
  following: true,
  followerIds: true,
  followingIds: true,
  toNotificationIds: true,
  conversationIds: true,
  tags: true,
  posts: { include: { createdBy: { select: BASIC_USER_SELECT_FIELDS } } },
  savedPostIds: true,
  savedPosts: { include: { createdBy: { select: BASIC_USER_SELECT_FIELDS } } },
  picture: true,
} satisfies Prisma.UserSelect
