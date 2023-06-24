import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const MESSAGE_INCLUDE_FIELDS: Prisma.MessageInclude = {
  conversation: true,
  from: { select: BASIC_USER_SELECT_FIELDS },
  recipient: { select: BASIC_USER_SELECT_FIELDS },
}
