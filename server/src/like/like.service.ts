import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Like } from '@prisma/client'
import { NotificationService } from '~/notification/notification.service'
import { PrismaService } from '~/prisma/prisma.service'
import { SocketGateway } from '~/socket/socket.gateway'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class LikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async likePost(postId: string, user: UserWithoutSensitiveData): Promise<Like> {
    const post = await this.prismaService.post.findFirst({ where: { id: postId }, include: { createdBy: true } })
    if (!post) {
      throw new NotFoundException('Post not found!')
    }

    const [likeCreated] = await Promise.all([
      /** Creating the notification */
      this.prismaService.like.create({
        data: {
          post: { connect: { id: post.id } },
          likedBy: { connect: { id: user.id } },
        },
      }),
      this.notificationService.createNotification(user.id, [post.createdById], 'liked your post.', 'LIKE', post.id),
    ])

    /** Emitting the event to all the followers to update likes */
    const to = post.createdBy.followerIds.filter((id) => id !== user.id).map((id) => `/global/${id}`)
    if (to.length) {
      this.socketGateway.wss.volatile.to(to).emit('like', likeCreated)
    }

    return likeCreated
  }

  async unlikePost(postId: string, user: UserWithoutSensitiveData): Promise<Like> {
    const post = await this.prismaService.post.findFirst({ where: { id: postId }, include: { createdBy: true } })
    if (!post) {
      throw new NotFoundException('Post not found!')
    }
    const like = await this.prismaService.like.findFirst({
      where: {
        post: { id: postId },
        likedBy: { id: user.id },
      },
    })

    if (!like) {
      throw new BadRequestException('Something went wrong!')
    }

    const dislike = await this.prismaService.like.delete({ where: { id: like.id } })

    /** Emitting the event to all the followers to update likes */
    const to = post.createdBy.followerIds.filter((id) => id !== user.id).map((id) => `/global/${id}`)
    if (to.length) {
      this.socketGateway.wss.volatile.to(to).emit('dislike', dislike)
    }

    return dislike
  }
}
