import { Notification } from '~/types/notification'

export function getRouteByNotificationType(notification: Notification): string {
  switch (notification.type) {
    case 'LIKE':
    case 'COMMENT': {
      return `/post/${notification.postId}`
    }

    case 'FOLLOW': {
      return `/profile/${notification.notificationBy.username}`
    }

    default: {
      throw new Error('Unknown notification type')
    }
  }
}
