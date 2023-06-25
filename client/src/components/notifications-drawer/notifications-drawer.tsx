import { cloneElement, useMemo, useState } from 'react'
import { Badge, Drawer, Result } from 'antd'
import { useNotifications } from '~/hooks/use-notifications'
import Loading from '../loading'
import { getErrorMessage } from '~/utils/error'
import Notification from './components/notification'

type NotificationsDrawerProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
  badgeClassName?: string
}

export default function NotificationsDrawer({ className, style, trigger, badgeClassName }: NotificationsDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isNotificationsLoading, notificationError, notifications, unreadNotifications } = useNotifications()

  const content = useMemo(() => {
    if (isNotificationsLoading) {
      return <Loading className="h-screen" title="Loading notifications..." />
    }

    if (notificationError) {
      return <Result subTitle={getErrorMessage(notificationError)} />
    }

    return (
      <div>
        {notifications?.length ? (
          notifications?.map((notification) => (
            <Notification key={notification.id} notification={notification} setIsDrawerOpen={setIsDrawerOpen} />
          ))
        ) : (
          <div className="flex w-full items-center justify-center p-4">No new notifications.</div>
        )}
      </div>
    )
  }, [isNotificationsLoading, notificationError, notifications])

  return (
    <>
      <Badge count={unreadNotifications.length} className={badgeClassName}>
        {cloneElement(trigger, {
          onClick: () => {
            setIsDrawerOpen(true)
          },
        })}
      </Badge>
      <Drawer
        bodyStyle={{ padding: 0 }}
        className={className}
        style={style}
        open={isDrawerOpen}
        title="Notifications"
        width={400}
        onClose={() => {
          setIsDrawerOpen(false)
        }}
      >
        {content}
      </Drawer>
    </>
  )
}
