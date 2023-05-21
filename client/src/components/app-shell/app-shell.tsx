import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHome, AiOutlineMessage, AiOutlineNotification, AiOutlineLogout } from 'react-icons/ai'
import { Avatar, Dropdown } from 'antd'
import { useAuthContext } from '../../hooks/use-auth'

type AppShellProps = {
  children: React.ReactElement
}

const NAVBAR_HEIGHT = 60

export default function AppShell({ children }: AppShellProps) {
  const { logout, user } = useAuthContext()

  return (
    <div>
      {/* Navigation Bar Start */}
      <div className="bg-background fixed left-0 top-0 z-10 w-full border-b-2 px-8 lg:px-0">
        <div
          className="mx-auto flex w-full max-w-screen-xl items-center justify-between"
          style={{ height: `${NAVBAR_HEIGHT}px` }}
        >
          <div className="text-2xl font-bold">
            <span className="text-primary">C</span>odebook
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
            <li className="hover:text-primary transition-all delay-75 ease-in-out">
              <Link to="/notifications">
                <AiOutlineNotification className="h-6 w-6" />
              </Link>
            </li>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
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
