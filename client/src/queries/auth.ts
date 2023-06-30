import { LoginDto, LoginWithGoogleDto, SignupDto } from '../types/auth'
import { UserWithoutSensitiveData } from '../types/user'
import { apiClient } from '../utils/client'

export async function signUp(dto: SignupDto) {
  const { data } = await apiClient.post<{ user: UserWithoutSensitiveData; token: string }>('/auth/signup', dto)
  return data
}

export async function isUsernameExists(username: string) {
  const { data } = await apiClient.get<boolean>('/auth/username-exists', { params: { username } })
  return data
}

export async function isEmailExists(email: string) {
  const { data } = await apiClient.get<boolean>('/auth/email-exists', { params: { email } })
  return data
}

export async function login(dto: LoginDto) {
  const { data } = await apiClient.post<{ user: UserWithoutSensitiveData; token: string }>('/auth/login', dto)
  return data
}

export async function loginWithGoogle(dto: LoginWithGoogleDto) {
  const { data } = await apiClient.post<{ user: UserWithoutSensitiveData; token: string }>(
    '/auth/login-with-google',
    dto,
  )
  return data
}
