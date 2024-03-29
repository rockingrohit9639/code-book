import { UpdateProfileDto, UserWithoutSensitiveData } from '../types/user'
import { apiClient } from '../utils/client'

export async function fetchLoggedInUser() {
  const { data } = await apiClient.get<UserWithoutSensitiveData>('/user/me')
  return data
}

export async function fetchProfile(username: string) {
  const { data } = await apiClient.get<UserWithoutSensitiveData>(`/user/${username}`)
  return data
}

export async function updateProfile(id: string, dto: UpdateProfileDto) {
  const { data } = await apiClient.patch<UserWithoutSensitiveData>(`/user/${id}`, dto)
  return data
}

export async function follow(id: string) {
  const { data } = await apiClient.post<[UserWithoutSensitiveData, UserWithoutSensitiveData]>(`/user/follow/${id}`)
  return data
}

export async function unfollow(id: string) {
  const { data } = await apiClient.post<[UserWithoutSensitiveData, UserWithoutSensitiveData]>(`/user/unfollow/${id}`)
  return data
}

export async function removeFollower(id: string) {
  const { data } = await apiClient.delete<UserWithoutSensitiveData>(`/user/followers/${id}`)
  return data
}

export async function searchUsers(query: string) {
  const { data } = await apiClient.get<UserWithoutSensitiveData[]>('/user/search', { params: { query } })
  return data
}

export async function savePost(postId: string) {
  const { data } = await apiClient.post<UserWithoutSensitiveData & { status: 'SAVED' | 'REMOVED' }>(
    `/user/save-post/${postId}`,
  )
  return data
}
