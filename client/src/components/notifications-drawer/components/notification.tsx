import { Avatar } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { Notification as NotificationType } from '~/types/notification'

type NotificationProps = {
  className?: string
  style?: React.CSSProperties
  notification: NotificationType
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Notification({ className, style, notification, setIsDrawerOpen }: NotificationProps) {
  const navigate = useNavigate()

  const handleRoute = () => {
    setIsDrawerOpen(false)
    navigate(`/post/${notification.postId}`)
  }

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
