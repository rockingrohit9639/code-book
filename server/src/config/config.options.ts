import { ConfigModuleOptions } from '@nestjs/config'
import * as joi from 'types-joi'
import { DEFAULT_MULTER_MAX_FILE_SIZE } from '~/constants/multer'

const validationSchema = joi
  .object({
    PORT: joi.number().positive().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    UPLOAD_DIR: joi.string().required(),
    MULTER_MAX_FILE_SIZE: joi.number().default(DEFAULT_MULTER_MAX_FILE_SIZE),
  })
  .required()

export type EnvironmentVars = joi.InterfaceFrom<typeof validationSchema>

export const configOptions: ConfigModuleOptions = {
  envFilePath: ['.env'],
  isGlobal: true,
  validationSchema,
}
