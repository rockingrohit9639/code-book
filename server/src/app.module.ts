import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configOptions } from './config/config.options'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [ConfigModule.forRoot(configOptions)],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
