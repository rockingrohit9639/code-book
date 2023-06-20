import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { getUserNotifications } from '~/queries/notification'

export function useNotifications() {
  const notifications = useQuery(['notifications'], getUserNotifications)

  const unreadNotifications = useMemo(
    () => notifications.data?.filter((notification) => notification.isRead === false) ?? [],
    [notifications],
  )

  return {
    isNotificationsLoading: notifications.isLoading,
    notificationError: notifications.error,
    unreadNotifications,
    notifications: notifications.data,
  }
}
