import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const MESSAGE_INCLUDE_FIELDS = {
  conversation: { include: { users: { select: BASIC_USER_SELECT_FIELDS } } },
  from: { select: BASIC_USER_SELECT_FIELDS },
  recipient: { select: BASIC_USER_SELECT_FIELDS },
} satisfies Prisma.MessageInclude
