import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const POST_INCLUDE_FIELDS = {
  createdBy: { select: BASIC_USER_SELECT_FIELDS },
  image: { include: { createdBy: { select: BASIC_USER_SELECT_FIELDS } } },
  likes: { include: { likedBy: { select: BASIC_USER_SELECT_FIELDS } } },
  comments: { include: { commentBy: { select: BASIC_USER_SELECT_FIELDS } } },
} satisfies Prisma.PostInclude
