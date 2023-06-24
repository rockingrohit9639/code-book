import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const COMMENT_INCLUDE_FIELDS = {
  commentBy: { select: BASIC_USER_SELECT_FIELDS },
} satisfies Prisma.CommentInclude
