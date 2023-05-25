import * as path from 'path'
import * as fs from 'fs'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { File } from '@prisma/client'
import { Response } from 'express'
import * as contentDisposition from 'content-disposition'
import { EnvironmentVars } from '~/config/config.options'
import { PrismaService } from '~/prisma/prisma.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { getFilename } from '~/config/multer.options'

@Injectable()
export class FileService {
  private uploadDirectory: string
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<EnvironmentVars, true>,
  ) {
    this.uploadDirectory = this.configService.get('UPLOAD_DIR')
  }

  uploadFile(user: UserWithoutSensitiveData, file: Express.Multer.File): Promise<File> {
    return this.prismaService.file.create({
      data: {
        originalName: file.originalname,
        encoding: file.encoding,
        mimeType: file.mimetype,
        filename: file.filename,
        size: file.size,
        createdBy: {
          connect: { id: user.id },
        },
      },
    })
  }

  private getFilePath(fileDto: File): string {
    return path.resolve(this.uploadDirectory, fileDto.filename)
  }

  private async findFileById(fileId: string): Promise<File> {
    const file = await this.prismaService.file.findFirst({ where: { id: fileId } })
    if (!file) {
      throw new NotFoundException('File not found!')
    }
    return file
  }

  async downloadFile(response: Response, fileId: string) {
    const file = await this.findFileById(fileId)
    const path = this.getFilePath(file)
    try {
      /** Verifying if the file exists on disk or not */
      await fs.promises.access(path)
    } catch (error) {
      throw new NotFoundException('File not found!')
    }

    response.setHeader('content-type', file.mimeType)
    response.setHeader('Content-Disposition', contentDisposition(file.filename, { type: 'inline' }))
    response.sendFile(path)
  }

  async createFileByBase64String(base64Image: string, user: UserWithoutSensitiveData): Promise<File> {
    /** Removing the header from base64 image string */
    const imageWithoutHeader = base64Image.split(';base64,').pop()
    if (!imageWithoutHeader) {
      throw new InternalServerErrorException('Something went wrong!')
    }

    /** Saving the file to disk */
    const filename = getFilename()
    const filePath = path.resolve(this.uploadDirectory, filename)
    fs.writeFile(filePath, imageWithoutHeader, 'base64', (error) => {
      if (error) {
        throw new InternalServerErrorException('Something went wrong!')
      }
    })

    return this.prismaService.file.create({
      data: {
        originalName: filename,
        encoding: '7bit',
        mimeType: 'image/png',
        filename,
        size: 1044659,
        createdBy: {
          connect: { id: user.id },
        },
      },
    })
  }
}
