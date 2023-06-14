import { BadRequestException, Injectable } from '@nestjs/common'
import { Like } from '@prisma/client'
import { PostService } from '~/post/post.service'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class LikeService {
  constructor(private readonly prismaService: PrismaService, private readonly postService: PostService) {}

  async likePost(postId: string, user: UserWithoutSensitiveData): Promise<Like> {
    const post = await this.postService.findOneById(postId)
    return this.prismaService.like.create({
      data: {
        post: { connect: { id: post.id } },
        likedBy: { connect: { id: user.id } },
      },
    })
  }

  async unlikePost(postId: string, user: UserWithoutSensitiveData): Promise<Like> {
    const like = await this.prismaService.like.findFirst({
      where: {
        post: { id: postId },
        likedBy: { id: user.id },
      },
    })

    if (!like) {
      throw new BadRequestException('Something went wrong!')
    }

    return this.prismaService.like.delete({
      where: { id: like.id },
    })
  }
}
