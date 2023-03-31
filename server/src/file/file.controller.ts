import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express, Response } from 'express'
import { File } from '@prisma/client'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { FileService } from './file.service'
import { GetUser } from '~/auth/user.decorator'
import { UserWithoutSensitiveData } from '~/user/user.type'

@UseGuards(JwtGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@GetUser() user: UserWithoutSensitiveData, @UploadedFile() file: Express.Multer.File): Promise<File> {
    return this.fileService.uploadFile(user, file)
  }

  @Get('/download/:fileId')
  getFile(@Res() response: Response, @Param('fileId') fileId: string) {
    return this.fileService.downloadFile(response, fileId)
  }
}
