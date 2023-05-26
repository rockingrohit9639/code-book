import { CreatePostDto, Post } from '~/types/post'
import { apiClient } from '~/utils/client'

export async function createPost(dto: CreatePostDto) {
  const { data } = await apiClient.post<Post>('/posts', dto)
  return data
}

export async function fetchPosts() {
  const { data } = await apiClient.get<Post[]>('/posts')
  return data
}
