import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configOptions } from './config/config.options'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'

@Module({
  imports: [ConfigModule.forRoot(configOptions), UserModule, AuthModule, FileModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
