import { Avatar } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import useError from '~/hooks/use-error'
import { markNotificationAsRead } from '~/queries/notification'
import { Notification as NotificationType } from '~/types/notification'
import { getRouteByNotificationType } from '~/utils/notification'

type NotificationProps = {
  className?: string
  style?: React.CSSProperties
  notification: NotificationType
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Notification({ className, style, notification, setIsDrawerOpen }: NotificationProps) {
  const navigate = useNavigate()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const markAsReadMutation = useMutation(markNotificationAsRead, {
    onError: handleError,
    onSuccess: (updatedNotification) => {
      setIsDrawerOpen(false)
      queryClient.setQueryData<NotificationType[]>(['notifications'], (prev) => {
        if (!prev) return []

        return prev.map((n) => {
          if (n.id === updatedNotification.id) {
            return updatedNotification
          }
          return n
        })
      })

      navigate(getRouteByNotificationType(updatedNotification))
    },
  })

  const handleRoute = useCallback(() => {
    markAsReadMutation.mutate(notification.id)
  }, [markAsReadMutation, notification.id])

  return (
    <div
      className={clsx(
        className,
        'cursor-pointer px-4 py-2 transition-all delay-75 hover:bg-gray-300',
        !notification.isRead && 'bg-gray-200',
      )}
      style={style}
      onClick={handleRoute}
    >
      <div className="flex items-center space-x-2">
        <Avatar className="uppercase">{notification.notificationBy.username[0]}</Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <div className="font-medium">@{notification.notificationBy.username}</div>
            <div className="text-sm"> {notification.content}</div>
          </div>
          <div className="text-sm text-gray-400">{dayjs(notification.createdAt).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}
