import { ConflictException, Injectable } from '@nestjs/common'
import { Tag } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateTagDto } from './tag.dto'

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTag(dto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.prismaService.tag.findFirst({ where: { tag: dto.tag } })

    if (existingTag) {
      throw new ConflictException('Tag is created!')
    }

    return this.prismaService.tag.create({
      data: { tag: dto.tag },
    })
  }

  findAll(): Promise<Tag[]> {
    return this.prismaService.tag.findMany()
  }
}
