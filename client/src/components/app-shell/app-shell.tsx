import React from 'react'
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

type AppShellProps = {
  children: React.ReactElement
}

const NAVBAR_HEIGHT = 60

export default function AppShell({ children }: AppShellProps) {
  const { logout, user } = useAuthContext()
  const navigate = useNavigate()

  return (
    <div>
      {/* Navigation Bar Start */}
      <div className="fixed left-0 top-0 z-10 w-full bg-white px-8 shadow lg:px-0">
        <div
          className="mx-auto flex w-full max-w-screen-xl items-center justify-between"
          style={{ height: `${NAVBAR_HEIGHT}px` }}
        >
          <div className="text-2xl font-bold">
            <Link to="/">
              <span className="text-primary">C</span>odebook
            </Link>
          </div>
          <ul className="flex items-center gap-4">
            <li className="hover:text-primary transition-all delay-75 ease-in-out">
              <Link to="/">
                <AiOutlineHome className="h-6 w-6" />
              </Link>
            </li>
            <li className="hover:text-primary transition-all delay-75 ease-in-out">
              <Link to="/messages">
                <AiOutlineMessage className="h-6 w-6" />
              </Link>
            </li>
            <NotificationsDrawer
              trigger={
                <li className="hover:text-primary cursor-pointer transition-all delay-75 ease-in-out">
                  <AiOutlineNotification className="h-6 w-6" />
                </li>
              }
            />
            <SearchUsersDrawer
              trigger={
                <li className="hover:text-primary cursor-pointer transition-all delay-75 ease-in-out">
                  <AiOutlineSearch className="h-6 w-6" />
                </li>
              }
            />
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'user',
                    icon: <AiOutlineUser />,
                    label: `@${user?.username}`,
                    onClick: () => {
                      navigate(`/profile/${user?.username}`)
                    },
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
              <Avatar className="bg-primary/80 text-background cursor-pointer">
                {user?.username[0].toUpperCase()}
              </Avatar>
            </Dropdown>
          </ul>
        </div>
      </div>
      {/* Navigation Bar End */}
      {children}
    </div>
  )
}

AppShell.NAVBAR_HEIGHT = NAVBAR_HEIGHT
