import { Badge, Drawer, Result } from 'antd'
import { cloneElement, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getUserNotifications } from '~/queries/notification'
import Loading from '../loading/loading'
import { getErrorMessage } from '~/utils/error'
import Notification from './components/notification'

type NotificationsDrawerProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function NotificationsDrawer({ className, style, trigger }: NotificationsDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const notifications = useQuery(['notifications'], getUserNotifications)

  const unreadNotifications = useMemo(
    () => notifications.data?.filter((notification) => notification.isRead === false) ?? [],
    [notifications],
  )

  const content = useMemo(() => {
    if (notifications.isLoading) {
      return <Loading title="Loading notifications..." />
    }

    if (notifications.error) {
      return <Result subTitle={getErrorMessage(notifications.error)} />
    }

    return (
      <div className="">
        {notifications.data?.length ? (
          notifications.data?.map((notification) => (
            <Notification key={notification.id} notification={notification} setIsDrawerOpen={setIsDrawerOpen} />
          ))
        ) : (
          <div>No new notifications.</div>
        )}
      </div>
    )
  }, [notifications])

  return (
    <>
      <Badge count={unreadNotifications.length}>
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
