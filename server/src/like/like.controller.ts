import { Controller, Delete, Param, Post as PostRoute, UseGuards } from '@nestjs/common'
import { Like } from '@prisma/client'
import { LikeService } from './like.service'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @PostRoute(':postId')
  likePost(@Param('postId') postId: string, @GetUser() user: UserWithoutSensitiveData): Promise<Like> {
    return this.likeService.likePost(postId, user)
  }

  @Delete(':postId/unlike')
  unlikePost(@Param('postId') postId: string, @GetUser() user: UserWithoutSensitiveData): Promise<Like> {
    return this.likeService.unlikePost(postId, user)
  }
}
