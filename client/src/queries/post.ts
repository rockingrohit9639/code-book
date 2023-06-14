import { CreatePostDto, Like, Post } from '~/types/post'
import { apiClient } from '~/utils/client'

export async function createPost(dto: CreatePostDto) {
  const { data } = await apiClient.post<Post>('/posts', dto)
  return data
}

export async function fetchPosts() {
  const { data } = await apiClient.get<Post[]>('/posts')
  return data
}

export async function likePost(postId: string) {
  const { data } = await apiClient.post<Like>(`/like/${postId}`)
  return data
}

export async function unlikePost(postId: string) {
  const { data } = await apiClient.delete<Like>(`/like/${postId}/unlike`)
  return data
}
