import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineNotification,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineSearch,
} from 'react-icons/ai'
import { Avatar, Dropdown } from 'antd'
import { useAuthContext } from '../../hooks/use-auth'
import NotificationsDrawer from '../notifications-drawer'
import SearchUsersDrawer from '../search-users-drawer'

type SidebarProps = {
  className?: string
  style?: React.CSSProperties
}

const LINK_CLASSNAME =
  'hover:text-primary transition-all delay-75 ease-in-out border border-transparent py-3 hover:bg-gray-200 w-52 rounded-tr-3xl rounded-br-3xl pl-2'

export default function Sidebar({ className, style }: SidebarProps) {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  return (
    <div className={clsx(className, 'flex flex-col justify-between px-4 py-8')} style={style}>
      <div>
        <Link to="/" className="mb-8 ml-2 block text-2xl font-bold">
          <span className="text-primary">C</span>odebook
        </Link>

        <ul className="flex flex-col space-y-2">
          <li className={LINK_CLASSNAME}>
            <Link to="/" className="flex items-center space-x-2">
              <AiOutlineHome className="h-6 w-6" />
              <div>Home</div>
            </Link>
          </li>
          <li className={LINK_CLASSNAME}>
            <Link to="/messages" className="flex items-center space-x-2">
              <AiOutlineMessage className="h-6 w-6" />
              <div>Messages</div>
            </Link>
          </li>
          <NotificationsDrawer
            badgeClassName="w-40"
            trigger={
              <li className={clsx('flex cursor-pointer items-center space-x-2', LINK_CLASSNAME)}>
                <AiOutlineNotification className="h-6 w-6" />
                <div>Notifications</div>
              </li>
            }
          />
          <SearchUsersDrawer
            trigger={
              <li className={clsx('flex cursor-pointer items-center space-x-2', LINK_CLASSNAME)}>
                <AiOutlineSearch className="h-6 w-6" />
                <div>Search</div>
              </li>
            }
          />
        </ul>
      </div>

      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'profile',
              icon: <AiOutlineUser />,
              label: 'Profile',
              onClick: () => navigate(`/profile/${user?.username}`),
            },
            {
              key: 'logout',
              icon: <AiOutlineLogout />,
              label: 'Logout',
              onClick: logout,
            },
          ],
        }}
      >
        <div className="flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200 px-4 py-2">
          <Avatar className="bg-primary/80 text-background cursor-pointer">{user?.username[0].toUpperCase()}</Avatar>
          <div>@{user?.username}</div>
        </div>
      </Dropdown>
    </div>
  )
}
