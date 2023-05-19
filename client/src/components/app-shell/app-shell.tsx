import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineHome, AiOutlineMessage, AiOutlineNotification, AiOutlineLogout } from 'react-icons/ai'
import { Avatar, Dropdown } from 'antd'

type AppShellProps = {
  children: React.ReactElement
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div>
      {/* Navigation Bar Start */}
      <div className="mb-2 border-b">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-4">
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
                  },
                ],
              }}
            >
              <Avatar className="bg-primary/80 text-background cursor-pointer">U</Avatar>
            </Dropdown>
          </ul>
        </div>
      </div>
      {/* Navigation Bar End */}

      {/* @TODO Add Sidebars */}
      <div className="grid grid-cols-12">
        <div className="col-span-3" />
        <div className="col-span-6">{children}</div>
        <div className="col-span-3" />
      </div>
    </div>
  )
}
