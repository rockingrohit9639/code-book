import { Prisma } from '@prisma/client'
import { USER_SELECT_FIELDS } from '~/user/user.fields'

export const POST_INCLUDE_FIELDS: Prisma.PostInclude = {
  createdBy: {
    select: USER_SELECT_FIELDS,
  },
  image: { include: { createdBy: true } },
}
