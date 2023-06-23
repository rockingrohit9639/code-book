import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { getUserNotifications } from '~/queries/notification'
import { useGlobalSocket } from './use-global-socket'
import { Notification } from '~/types/notification'

export function useNotifications() {
  const notifications = useQuery(['notifications'], getUserNotifications)
  const { socket } = useGlobalSocket()
  const queryClient = useQueryClient()

  useEffect(
    function listenToNotifications() {
      /** Listening to new notifications */
      socket.on('notification', (payload: Notification) => {
        queryClient.setQueryData<Notification[]>(['notifications'], (oldData) => {
          if (oldData) {
            return [payload, ...oldData]
          }
          return [payload]
        })
      })

      return () => {
        socket.off('notification')
      }
    },
    [socket, queryClient],
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
