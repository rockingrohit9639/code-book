import { Body, Controller, Get, Post } from '@nestjs/common'
import { Tag } from '@prisma/client'
import { TagService } from './tag.service'
import { CreateTagDto } from './tag.dto'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(dto)
  }

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll()
  }
}
