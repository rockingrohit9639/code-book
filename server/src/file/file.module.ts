import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { PrismaService } from '~/prisma/prisma.service'
import createMulterOptions from '~/config/multer.options'

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: createMulterOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [FileService, PrismaService],
  exports: [FileService],
})
export class FileModule {}
