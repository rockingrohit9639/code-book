import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Post } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { POST_INCLUDE_FIELDS } from './post.fields'
import { FileService } from '~/file/file.service'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService, private readonly fileService: FileService) {}

  findAll(): Promise<Post[]> {
    return this.prismaService.post.findMany()
  }

  async findOneById(id: string): Promise<Post> {
    const post = await this.prismaService.post.findFirst({ where: { id } })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  async create(dto: CreatePostDto, user: UserWithoutSensitiveData) {
    const imageCreated = await this.fileService.createFileByBase64String(dto.imageBase64, user)

    return this.prismaService.post.create({
      data: {
        title: dto.title,
        codeSnippet: dto.codeSnippet,
        image: { connect: { id: imageCreated.id } },
        createdBy: { connect: { id: user.id } },
      },
      include: POST_INCLUDE_FIELDS,
    })
  }

  async update(id: string, dto: UpdatePostDto, user: UserWithoutSensitiveData): Promise<Post> {
    const post = await this.findOneById(id)
    if (post.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to update this post!')
    }
    return this.prismaService.post.update({
      where: { id: post.id },
      data: { title: dto.title },
    })
  }

  async delete(id: string, user: UserWithoutSensitiveData): Promise<Post> {
    const post = await this.findOneById(id)
    if (post.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this post!')
    }
    return this.prismaService.post.delete({ where: { id: post.id } })
  }
}
