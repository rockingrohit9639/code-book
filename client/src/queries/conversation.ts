import { Conversation, CreateConversationDto } from '~/types/conversation'
import { apiClient } from '~/utils/client'

export async function createConversation(dto: CreateConversationDto) {
  const { data } = await apiClient.post<Conversation>('/conversations', dto)
  return data
}
