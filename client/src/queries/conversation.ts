import { Conversation, CreateConversationDto } from '~/types/conversation'
import { apiClient } from '~/utils/client'

export async function createConversation(dto: CreateConversationDto) {
  const { data } = await apiClient.post<Conversation>('/conversations', dto)
  return data
}

export async function getUserConversations() {
  const { data } = await apiClient.get<Conversation[]>('/conversations')
  return data
}
