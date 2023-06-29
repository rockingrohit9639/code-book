import { Module } from '@nestjs/common'
import { TagsController } from './tag.controller'
import { PrismaService } from '~/prisma/prisma.service'
import { TagService } from './tag.service'

@Module({
  imports: [],
  controllers: [TagsController],
  providers: [PrismaService, TagService],
  exports: [TagService],
})
export class TagModule {}
