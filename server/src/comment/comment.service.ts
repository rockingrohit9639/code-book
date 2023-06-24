import { Injectable, NotFoundException } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateCommentDto } from './comment.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { COMMENT_INCLUDE_FIELDS } from './comment.fields'
import { NotificationService } from '~/notification/notification.service'
import { SocketGateway } from '~/socket/socket.gateway'

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async createComment(postId: string, dto: CreateCommentDto, user: UserWithoutSensitiveData): Promise<Comment> {
    const post = await this.prismaService.post.findFirst({ where: { id: postId }, include: { createdBy: true } })
    if (!post) {
      throw new NotFoundException('Post not found!')
    }

    const [commentCreated] = await Promise.all([
      this.prismaService.comment.create({
        data: {
          commentById: user.id,
          postId,
          comment: dto.comment,
        },
        include: COMMENT_INCLUDE_FIELDS,
      }),
      this.notificationService.createNotification(
        user.id,
        [post.createdById],
        'commented on your post.',
        'COMMENT',
        post.id,
      ),
    ])

    /** Emitting the event to add comment on every follower's feed */
    const to = post.createdBy.followerIds.filter((id) => id !== user.id).map((id) => `/global/${id}`)
    if (to.length) {
      this.socketGateway.wss.volatile.to(to).emit('comment', commentCreated)
    }

    return commentCreated
  }

  async deleteComment(id: string, user: UserWithoutSensitiveData): Promise<Comment> {
    const comment = await this.prismaService.comment.findFirst({ where: { id } })
    if (!comment) {
      throw new NotFoundException('Comment not found!')
    }
    const post = await this.prismaService.post.findFirst({
      where: { id: comment.postId },
      include: { createdBy: true },
    })
    if (!post) {
      throw new NotFoundException('Post not found!')
    }

    const deletedComment = await this.prismaService.comment.delete({ where: { id } })

    /** Emitting the event to remove comment from every follower's feed */
    const to = post.createdBy.followerIds.filter((id) => id !== user.id).map((id) => `/global/${id}`)
    if (to.length) {
      this.socketGateway.wss.volatile.to(to).emit('remove-comment', deletedComment)
    }

    return deletedComment
  }
}
