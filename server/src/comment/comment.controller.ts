import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './comment.dto'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<Comment> {
    return this.commentService.createComment(postId, dto, user)
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string): Promise<Comment> {
    return this.commentService.deleteComment(id)
  }
}
