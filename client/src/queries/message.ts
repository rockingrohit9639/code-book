import { Message } from '~/types/message'
import { apiClient } from '~/utils/client'

export async function getConversationMessages(conversationId: string) {
  const { data } = await apiClient.get<Message[]>(`/messages/${conversationId}`)
  return data
}
