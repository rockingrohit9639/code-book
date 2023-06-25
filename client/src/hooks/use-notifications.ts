import { useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { getUserNotifications } from '~/queries/notification'
import { Notification } from '~/types/notification'
import { useSocketContext } from './use-socket'

export function useNotifications() {
  const notifications = useQuery(['notifications'], getUserNotifications)
  const { socket } = useSocketContext()
  const queryClient = useQueryClient()

  const handleNewNotification = useCallback(
    (payload: Notification) => {
      queryClient.setQueryData<Notification[]>(['notifications'], (oldData) => {
        if (oldData) {
          return [payload, ...oldData]
        }
        return [payload]
      })
    },
    [queryClient],
  )

  useEffect(
    function listenToNotifications() {
      /** Listening to new notifications */
      socket.on('notification', handleNewNotification)

      return () => {
        socket.off('notification', handleNewNotification)
      }
    },
    [socket, queryClient, handleNewNotification],
  )

  const unreadNotifications = useMemo(
    () => notifications.data?.filter((notification) => notification.isRead === false) ?? [],
    [notifications.data],
  )

  return {
    isNotificationsLoading: notifications.isLoading,
    notificationError: notifications.error,
    unreadNotifications,
    notifications: notifications.data,
  }
}
