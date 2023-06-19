import { Injectable } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateCommentDto } from './comment.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { COMMENT_INCLUDE_FIELDS } from './comment.fields'
import { NotificationService } from '~/notification/notification.service'
import { PostService } from '~/post/post.service'

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationService,
  ) {}

  async createComment(postId: string, dto: CreateCommentDto, user: UserWithoutSensitiveData): Promise<Comment> {
    const post = await this.postService.findOneById(postId)

    const [commentCreated] = await Promise.all([
      this.prismaService.comment.create({
        data: {
          commentById: user.id,
          postId,
          comment: dto.comment,
        },
        include: COMMENT_INCLUDE_FIELDS,
      }),
      this.notificationService.createNotification(user.id, post.createdById, 'commented on your post.'),
    ])

    return commentCreated
  }

  deleteComment(id: string): Promise<Comment> {
    return this.prismaService.comment.delete({ where: { id } })
  }
}
