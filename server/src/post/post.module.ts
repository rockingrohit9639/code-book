import { Module } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { FileModule } from '~/file/file.module'

@Module({
  imports: [FileModule],
  controllers: [PostController],
  providers: [PostService, PrismaService],
  exports: [],
})
export class PostModule {}
