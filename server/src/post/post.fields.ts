import { Prisma } from '@prisma/client'
import { omit } from 'lodash'
import { USER_SELECT_FIELDS } from '~/user/user.fields'

export const POST_INCLUDE_FIELDS: Prisma.PostInclude = {
  createdBy: {
    select: omit(USER_SELECT_FIELDS, 'posts'),
  },
  image: { include: { createdBy: { select: omit(USER_SELECT_FIELDS, 'posts') } } },
  likes: { include: { likedBy: { select: omit(USER_SELECT_FIELDS, 'posts') } } },
}
