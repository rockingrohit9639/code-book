import { Prisma } from '@prisma/client'
import { USER_SELECT_FIELDS } from '~/user/user.fields'

export const NOTIFICATION_INCLUDE_FIELDS = {
  notificationBy: { select: USER_SELECT_FIELDS },
  notificationTo: { select: USER_SELECT_FIELDS },
} satisfies Prisma.NotificationInclude
