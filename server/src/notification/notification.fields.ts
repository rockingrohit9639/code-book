import { Prisma } from '@prisma/client'
import { BASIC_USER_SELECT_FIELDS } from '~/user/user.fields'

export const NOTIFICATION_INCLUDE_FIELDS = {
  notificationBy: { select: BASIC_USER_SELECT_FIELDS },
  notificationTo: { select: BASIC_USER_SELECT_FIELDS },
} satisfies Prisma.NotificationInclude
