import { Injectable } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateCommentDto } from './comment.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  createComment(postId: string, dto: CreateCommentDto, user: UserWithoutSensitiveData): Promise<Comment> {
    return this.prismaService.comment.create({
      data: {
        commentById: user.id,
        postId,
        comment: dto.comment,
      },
    })
  }

  deleteComment(id: string): Promise<Comment> {
    return this.prismaService.comment.delete({ where: { id } })
  }
}
