import { CreatePostDto, Post } from '~/types/post'
import { apiClient } from '~/utils/client'

export async function createPost(dto: CreatePostDto) {
  const { data } = await apiClient.post<Post>('/posts', dto)
  return data
}
