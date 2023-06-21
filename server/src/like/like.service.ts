import { BadRequestException, Injectable } from '@nestjs/common'
import { Like } from '@prisma/client'
import { NotificationService } from '~/notification/notification.service'
import { PostService } from '~/post/post.service'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class LikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {}

  async likePost(postId: string, user: UserWithoutSensitiveData): Promise<Like> {
    const post = await this.postService.findOneById(postId)

    const [likeCreated] = await Promise.all([
      /** Creating the notification */
      this.prismaService.like.create({
        data: {
          post: { connect: { id: post.id } },
          likedBy: { connect: { id: user.id } },
        },
      }),
      this.notificationService.createNotification(user.id, [post.createdById], 'liked your post.', post.id),
    ])

    return likeCreated
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
