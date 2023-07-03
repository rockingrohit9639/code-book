import { CreatePostDto, Like, Post, Comment } from '~/types/post'
import { apiClient } from '~/utils/client'

export async function createPost(dto: CreatePostDto) {
  const { data } = await apiClient.post<Post>('/posts', dto)
  return data
}

export async function fetchPosts() {
  const { data } = await apiClient.get<Post[]>('/posts')
  return data
}

export async function deletePost(id: string) {
  const { data } = await apiClient.delete<Post>(`/posts/${id}`)
  return data
}

export async function fetchPostDetails(id: string) {
  const { data } = await apiClient.get<Post>(`/posts/${id}`)
  return data
}

export async function fetchTrendingPosts() {
  const { data } = await apiClient.get<Post[]>('/posts/trending')
  return data
}

/** Likes */
export async function likePost(postId: string) {
  const { data } = await apiClient.post<Like>(`/like/${postId}`)
  return data
}

export async function unlikePost(postId: string) {
  const { data } = await apiClient.delete<Like>(`/like/${postId}/unlike`)
  return data
}

/** Comments */
export async function addComment(postId: string, comment: string) {
  const { data } = await apiClient.post<Comment>(`/comment/${postId}`, { comment })
  return data
}

export async function deleteComment(commentId: string) {
  const { data } = await apiClient.delete<Comment>(`/comment/${commentId}`)
  return data
}

/** Views */
export async function updateViews(id: string) {
  const { data } = await apiClient.post(`/posts/views/${id}`)
  return data
}
