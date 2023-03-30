import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { PrismaService } from '~/prisma/prisma.service'
import { UserModule } from '~/user/user.module'
import { createJwtOptions } from '~/config/jwt.options'

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: createJwtOptions,
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, PrismaService],
  exports: [],
})
export class AuthModule {}
