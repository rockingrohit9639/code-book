import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config'
import { uniqBy } from 'lodash'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { BadRequestException } from '@nestjs/common'
import { MimeType } from '~/file/file.type'
import { EnvironmentVars } from './config.options'
import { VALID_IMAGE_TYPES } from '~/constants/multer'

function getFilename() {
  return crypto.randomBytes(16).toString('hex')
}

export function mimeTypeToFileExtension(mimeType: MimeType) {
  switch (mimeType) {
    case 'image/png':
      return 'png'
    case 'image/jpeg':
      return 'jpeg'
    case 'image/jpg':
      return 'jpg'
    case 'application/pdf':
      return 'pdf'
    default:
      return 'unknown'
  }
}

export function mimeTypesToFileExtensions(types: MimeType[]) {
  return uniqBy(types.map(mimeTypeToFileExtension).flat(), (t) => t).join(', ')
}

const createMulterOptions = (configService: ConfigService<EnvironmentVars>): MulterOptions => {
  return {
    storage: diskStorage({
      filename: (req, file, cb) => {
        const filename = getFilename()

        cb(null, filename)
      },
      destination: configService.get('UPLOAD_DIR'),
    }),
    limits: {
      fileSize: configService.get('MULTER_MAX_FILE_SIZE'),
    },
    fileFilter: (req, file, cb) => {
      if ((VALID_IMAGE_TYPES as string[]).includes(file.mimetype) === false) {
        cb(
          new BadRequestException(`The image should be of format ${mimeTypesToFileExtensions(VALID_IMAGE_TYPES)}`),
          false,
        )
      }

      cb(null, true)
    },
    dest: configService.get('UPLOAD_DIR'),
  }
}

export default createMulterOptions
