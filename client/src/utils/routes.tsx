import { AiOutlineHome, AiOutlineMessage, AiOutlineNotification, AiOutlineSearch } from 'react-icons/ai'
import NotificationsDrawer from '~/components/notifications-drawer/notifications-drawer'
import SearchUsersDrawer from '~/components/search-users-drawer'

type BaseRoute = {
  id: string
  name: React.ReactNode
  icon: React.ReactElement<{ className?: string }>
}

type Route = BaseRoute & {
  type: 'ROUTE'
  path: string
  patterns: string[]
}

type ReactNode = BaseRoute & {
  type: 'REACT_NODE'
}

type AppShellRoute = Route | ReactNode

export const ROUTES: AppShellRoute[] = [
  {
    id: 'home',
    name: 'Home',
    icon: <AiOutlineHome />,
    path: '/',
    patterns: ['/'],
    type: 'ROUTE',
  },
  {
    id: 'messages',
    name: 'Messages',
    icon: <AiOutlineMessage />,
    path: '/messages',
    patterns: ['/messages'],
    type: 'ROUTE',
  },
  {
    id: 'notifications',
    name: <NotificationsDrawer trigger={<div className="text-gray-400 hover:text-white">Notifications</div>} />,
    icon: <AiOutlineNotification />,
    type: 'REACT_NODE',
  },
  {
    id: 'search',
    name: <SearchUsersDrawer trigger={<div>Search</div>} />,
    icon: <AiOutlineSearch />,
    type: 'REACT_NODE',
  },
]
