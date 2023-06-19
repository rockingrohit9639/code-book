import { Notification } from '~/types/notification'
import { apiClient } from '~/utils/client'

export async function getUserNotifications() {
  const { data } = await apiClient.get<Notification[]>('/notifications')
  return data
}

export async function markNotificationAsRead(id: string) {
  const { data } = await apiClient.patch<Notification>(`/notifications/mark-as-read/${id}`)
  return data
}
