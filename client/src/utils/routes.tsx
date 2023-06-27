import { AiOutlineHome, AiOutlineMessage, AiOutlineNotification, AiOutlineSearch } from 'react-icons/ai'
import NotificationsDrawer from '~/components/notifications-drawer/notifications-drawer'
import SearchUsersDrawer from '~/components/search-users-drawer'

type BaseRoute = {
  id: string
  item: React.ReactNode
  icon: React.ReactElement<{ className?: string }>
}

type Route = BaseRoute & {
  type: 'ROUTE'
  path: string
  patterns: string[]
}

type ReactNode = BaseRoute & {
  type: 'REACT_NODE'
  secondaryItem: React.ReactNode
}

type AppShellRoute = Route | ReactNode

export const ROUTES: AppShellRoute[] = [
  {
    id: 'home',
    item: 'Home',
    icon: <AiOutlineHome />,
    path: '/',
    patterns: ['/'],
    type: 'ROUTE',
  },
  {
    id: 'messages',
    item: 'Messages',
    icon: <AiOutlineMessage />,
    path: '/messages',
    patterns: ['/messages', '/messaged/:conversationId'],
    type: 'ROUTE',
  },
  {
    id: 'notifications',
    item: (
      <NotificationsDrawer
        trigger={
          <div className="hover:bg-primary cursor-pointer rounded px-4 py-2 text-gray-400 hover:text-gray-200">
            Notifications
          </div>
        }
      />
    ),
    icon: <AiOutlineNotification />,
    type: 'REACT_NODE',
    secondaryItem: (
      <NotificationsDrawer
        trigger={
          <div className="hover:bg-primary h-max w-max cursor-pointer rounded px-4 py-2 text-gray-400 hover:text-gray-200">
            <AiOutlineNotification className="h-6 w-6" />
          </div>
        }
      />
    ),
  },
  {
    id: 'search',
    item: (
      <SearchUsersDrawer
        trigger={
          <div className="hover:bg-primary h-max w-max cursor-pointer rounded px-4 py-2 text-gray-400 hover:text-gray-200">
            Search
          </div>
        }
      />
    ),
    icon: <AiOutlineSearch />,
    type: 'REACT_NODE',
    secondaryItem: (
      <SearchUsersDrawer
        trigger={
          <div className="hover:bg-primary h-max w-max cursor-pointer rounded px-4 py-2 text-gray-400 hover:text-gray-200">
            <AiOutlineSearch className="h-6 w-6" />
          </div>
        }
      />
    ),
  },
]
