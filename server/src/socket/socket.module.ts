import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { SocketGateway } from './socket.gateway'
import { createJwtOptions } from '~/config/jwt.options'
import { PrismaService } from '~/prisma/prisma.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: createJwtOptions,
      inject: [ConfigService],
    }),
  ],
  providers: [SocketGateway, PrismaService],
  exports: [SocketGateway],
})
export class SocketModule {}
