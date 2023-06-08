import { UserWithoutSensitiveData } from '../types/user'
import { apiClient } from '../utils/client'

export async function fetchLoggedInUser() {
  const { data } = await apiClient.get<UserWithoutSensitiveData>('/user/me')
  return data
}

export async function fetchProfile(id: string) {
  const { data } = await apiClient.get<UserWithoutSensitiveData>(`/user/${id}`)
  return data
}
