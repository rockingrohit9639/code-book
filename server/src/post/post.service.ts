import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Post } from '@prisma/client'
import { orderBy, take } from 'lodash'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '~/prisma/prisma.service'
import { CreatePostDto, UpdatePostDto } from './post.dto'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { POST_INCLUDE_FIELDS } from './post.fields'
import { FileService } from '~/file/file.service'
import { NotificationService } from '~/notification/notification.service'
import { COMMENT_RATING, LIKE_RATING, VIEWS_RATING } from './post.utils'

@Injectable()
export class PostService {
  private logger: Logger = new Logger('PostsLogger')

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
  ) {}

  findAll(user: UserWithoutSensitiveData): Promise<Post[]> {
    return this.prismaService.post.findMany({
      where: { OR: [{ createdBy: { followerIds: { has: user.id } } }, { createdBy: { id: user.id } }] },
      include: POST_INCLUDE_FIELDS,
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOneById(id: string): Promise<Post> {
    const post = await this.prismaService.post.findFirst({ where: { id }, include: POST_INCLUDE_FIELDS })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  async create(dto: CreatePostDto, user: UserWithoutSensitiveData) {
    const imageCreated = await this.fileService.createFileByBase64String(dto.imageBase64, user)

    const post = await this.prismaService.post.create({
      data: {
        title: dto.title,
        codeSnippet: dto.codeSnippet,
        tags: dto.tags,
        image: { connect: { id: imageCreated.id } },
        createdBy: { connect: { id: user.id } },
      },
      include: POST_INCLUDE_FIELDS,
    })

    await this.notificationService.createNotification(
      user.id,
      user.followerIds,
      'uploaded a new post.',
      'POST_UPLOAD',
      post.id,
    )
    return post
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

  async addViewOnPost(id: string, user: UserWithoutSensitiveData): Promise<Post> {
    const post = await this.findOneById(id)
    const existedViewForUser = await this.prismaService.view.findFirst({
      where: { userId: user.id, postId: post.id },
    })

    if (existedViewForUser) {
      return post
    }

    const [, postWithUpdatedViews] = await Promise.all([
      this.prismaService.view.create({
        data: { userId: user.id, postId: id },
      }),
      this.prismaService.post.update({
        where: { id },
        data: { views: { increment: 1 } },
      }),
    ])

    return postWithUpdatedViews
  }

  /** Method to calculate the trending score of post based on its views, likes and comments */
  private calculateTrendingScore(likes: number, comments: number, views: number): number {
    /**
     * Metric Scores Table
     * Likes Score -> 0.4
     * Comments Score -> 0.3
     * Views Score -> 0.3
     */
    const likesScore = LIKE_RATING * likes
    const commentsScore = COMMENT_RATING * comments
    const viewsScore = VIEWS_RATING * views ?? 0

    return likesScore + commentsScore + viewsScore
  }

  /** A cron job to find and add new posts to trending every-night */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async findAndUpdateTrendingPosts() {
    try {
      this.logger.log('Started Updating Trending Posts')
      const posts = await this.prismaService.post.findMany({
        include: { likes: true, comments: true },
      })

      /** Calculating post's trending scores */
      const postsWithTrendingScore = posts.map((post) => {
        return {
          ...post,
          trendingScore: this.calculateTrendingScore(post.likes.length, post.comments.length, post.views),
        }
      })

      const oldTrendingPosts = await this.prismaService.trendingPost.findMany()

      /** Getting top 10 trending score posts */
      const topPosts = take(
        orderBy(postsWithTrendingScore, (post) => post.trendingScore, 'desc'),
        10,
      )

      /** Adding new trending posts in database */
      await this.prismaService.trendingPost.createMany({
        data: topPosts.map((post) => ({ postId: post.id, score: post.trendingScore ?? 0 })),
      })

      /** Removing old trending posts */
      await this.prismaService.trendingPost.deleteMany({
        where: { id: { in: oldTrendingPosts.map((post) => post.id) } },
      })

      this.logger.log('Done updating trending posts.')
    } catch (error) {
      this.logger.error('Error updating trending posts.')
      this.logger.error(error)
    }
  }
}
