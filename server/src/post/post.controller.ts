import { Body, Controller, Delete, Get, Param, Patch, Post as PostRoute, UseGuards } from '@nestjs/common'
import { Post } from '@prisma/client'
import { PostService } from './post.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(): Promise<Post[]> {
    return this.postService.findAll()
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Post> {
    return this.postService.findOneById(id)
  }

  @PostRoute()
  create(@Body() dto: CreatePostDto, @GetUser() user: UserWithoutSensitiveData): Promise<Post> {
    return this.postService.create(dto, user)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @GetUser() user: UserWithoutSensitiveData,
  ): Promise<Post> {
    return this.postService.update(id, dto, user)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: UserWithoutSensitiveData): Promise<Post> {
    return this.postService.delete(id, user)
  }
}
