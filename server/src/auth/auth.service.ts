import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { omit } from 'lodash'
import { OAuth2Client, TokenPayload, UserRefreshClient } from 'google-auth-library'
import { ConfigService } from '@nestjs/config'
import { AxiosInstance } from 'axios'
import * as qs from 'qs'
import { Octokit } from '@octokit/core'
import { UserService } from '~/user/user.service'
import { UserWithoutSensitiveData } from '~/user/user.type'
import { LinkOrLoginWithGithubDto, LinkOrLoginWithGoogleDto, LoginDto, SignupDto } from './auth.dto'
import { JwtPayload } from './jwt/jwt.type'
import { EnvironmentVars } from '~/config/config.options'

@Injectable()
export class AuthService {
  private readonly client: OAuth2Client

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVars>,
    @Inject('GITHUB_API_CLIENT') private readonly githubApiClient: AxiosInstance,
  ) {
    this.client = new OAuth2Client(configService.get('GOOGLE_CLIENT_ID'), configService.get('GOOGLE_CLIENT_SECRET'))
  }

  async validatePayload(payload: JwtPayload): Promise<UserWithoutSensitiveData> {
    const user = await this.userService.findOneByEmail(payload.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return omit(user, 'password', 'salt')
  }

  async login(dto: LoginDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const user = await this.userService.validateUser(dto.usernameOrEmail, dto.password)
    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)
    return {
      user,
      token,
    }
  }

  async signup(dto: SignupDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const user = await this.userService.createUser(dto)
    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)
    return {
      user,
      token,
    }
  }

  async isUsernameExists(username: string): Promise<boolean> {
    return this.userService.isUsernameExists(username)
  }

  async isEmailExists(email: string): Promise<boolean> {
    return this.userService.isEmailExists(email)
  }

  private async getPayloadByAccessToken(access_token: string): Promise<TokenPayload> {
    try {
      /** Verifying if the access_token sent by user is valid */
      const refreshClient = new UserRefreshClient(
        this.configService.get('GOOGLE_CLIENT_ID'),
        this.configService.get('GOOGLE_CLIENT_SECRET'),
        access_token,
      )
      /** Getting the credentials if it is valid */
      const { credentials } = await refreshClient.refreshAccessToken()

      if (!credentials.id_token) {
        throw new InternalServerErrorException('Something went wrong, please try again!')
      }

      /** Getting ticket from the token */
      const ticket = await this.client.verifyIdToken({
        idToken: credentials.id_token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      })
      const payload = ticket.getPayload()

      if (!payload) {
        throw new InternalServerErrorException('Something went wrong, please try again!')
      }

      return payload
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong, please try again!')
    }
  }

  async linkAccountWithGoogle(
    dto: LinkOrLoginWithGoogleDto,
    user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    const payload = await this.getPayloadByAccessToken(dto.access_token)
    if (!payload?.sub) {
      throw new InternalServerErrorException('Something went wrong, please try again!')
    }

    const existingUser = await this.userService.findOneBySub(payload.sub)
    if (existingUser) {
      throw new ConflictException('This google account is already linked with another account!')
    }

    /** If everything goes well, we will add sub in our user which will make sure if account is linked with google or not */
    return this.userService.addGoogleSubInUser(user.id, payload.sub, payload.picture)
  }

  async loginWithGoogle(dto: LinkOrLoginWithGoogleDto): Promise<{ user: UserWithoutSensitiveData; token: string }> {
    const payload = await this.getPayloadByAccessToken(dto.access_token)
    if (!payload?.sub) {
      throw new InternalServerErrorException('Something went wrong, please try again!')
    }

    const user = await this.userService.findOneBySub(payload.sub)
    if (!user) {
      throw new NotFoundException('You account is not link with google!')
    }

    const jwtPayload = { id: user.id, email: user.email } satisfies JwtPayload
    const token = await this.jwtService.signAsync(jwtPayload)

    return {
      user,
      token,
    }
  }

  async linkAccountWithGithub(
    dto: LinkOrLoginWithGithubDto,
    user: UserWithoutSensitiveData,
  ): Promise<UserWithoutSensitiveData> {
    /** Getting the access token from code provided by github */
    const access_token = await this.exchangeCodeForToken(dto.code)

    /** Getting the user data by access token  */
    const data = await this.getUserDataByAccessToken(access_token)
    const existingUser = await this.userService.findOneByGithubUsername(data.username)
    if (existingUser) {
      throw new ConflictException('This github account is already linked with another account!')
    }

    /** If everything goes well, we will add github provided data in our database */
    return this.userService.addGithubDataInUser(user.id, data.username, data.profile)
  }

  /** Exchanging the authentication code for an access token */
  private async exchangeCodeForToken(code: string): Promise<string> {
    const options = {
      client_id: this.configService.get('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
      code,
    }

    const { data } = await this.githubApiClient.post(`/login/oauth/access_token?${qs.stringify(options)}`, undefined, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!data.access_token) {
      throw new InternalServerErrorException('Something went wrong while verifying!')
    }

    return data.access_token
  }

  /** Getting user data by access token */
  private async getUserDataByAccessToken(access_token: string): Promise<{ username: string; profile: string }> {
    try {
      const octokit = new Octokit({ auth: access_token })
      const { data } = await octokit.request('GET /user')

      if (!data.login) {
        throw new InternalServerErrorException('Something went wrong while verifying!')
      }

      return { username: data.login, profile: data.avatar_url }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while verifying')
    }
  }
}
