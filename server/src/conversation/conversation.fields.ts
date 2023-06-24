import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const CONVERSATION_INCLUDE_FIELDS: Prisma.ConversationInclude = {
  createdBy: { select: BASIC_USER_SELECT_FIELDS },
  users: { select: BASIC_USER_SELECT_FIELDS },
}
