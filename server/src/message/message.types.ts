import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export type MessageWithUserData = Prisma.MessageGetPayload<{
  include: {
    conversation: true
    from: { select: typeof BASIC_USER_SELECT_FIELDS }
    recipient: { select: typeof BASIC_USER_SELECT_FIELDS }
  }
}>
