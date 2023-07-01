import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { AuthService } from './auth.service'
import { PrismaService } from '~/prisma/prisma.service'
import { UserModule } from '~/user/user.module'
import { createJwtOptions } from '~/config/jwt.options'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt/jwt.strategy'

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
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    {
      provide: 'GITHUB_API_CLIENT',
      useFactory: () => {
        return axios.create({
          baseURL: 'https://github.com',
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class AuthModule {}
