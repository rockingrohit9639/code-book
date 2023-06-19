import { Notification } from '~/types/notification'
import { apiClient } from '~/utils/client'

export async function getUserNotifications() {
  const { data } = await apiClient.get<Notification[]>('/notifications')
  return data
}
