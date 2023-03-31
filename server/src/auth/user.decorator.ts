import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserWithoutSensitiveData } from '~/user/user.type'

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: UserWithoutSensitiveData = request.user
  return user
})
