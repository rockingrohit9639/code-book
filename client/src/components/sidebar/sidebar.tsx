import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'
import { Avatar, Dropdown, Menu, SiderProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import { useAuthContext } from '../../hooks/use-auth'
import AppShell from '../app-shell/app-shell'
import { ROUTES } from '~/utils/routes'
import { useAppShellContext } from '~/hooks/use-app-shell'

type SidebarProps = SiderProps

export default function Sidebar(props: SidebarProps) {
  const { isSiderCollapsed } = useAppShellContext()
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  return (
    <Sider
      width={AppShell.SIDEBAR_WIDTH}
      breakpoint="lg"
      className="fixed left-0 top-0 bottom-0 h-screen overflow-hidden p-4"
      collapsed={isSiderCollapsed}
      {...props}
    >
      <div className="flex h-full flex-col items-center justify-between">
        <div>
          <div className="text-background mb-4 text-2xl font-bold">{!isSiderCollapsed ? 'Codebook' : null}</div>
          <Menu
            className="h-full"
            theme="dark"
            mode="inline"
            items={ROUTES.map((route) => ({
              key: route.id,
              label: route.type === 'REACT_NODE' ? route.name : <Link to={route.path}>{route.name}</Link>,
              icon: React.cloneElement(route.icon, { className: 'h-6 w-6' }),
            }))}
          />
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
          {isSiderCollapsed ? (
            <Avatar className="bg-primary/80 text-background cursor-pointer">{user?.username[0].toUpperCase()}</Avatar>
          ) : (
            <div className="flex cursor-pointer items-center space-x-2 rounded-full bg-gray-200 px-4 py-2">
              <Avatar className="bg-primary/80 text-background cursor-pointer">
                {user?.username[0].toUpperCase()}
              </Avatar>
              <div>@{user?.username}</div>
            </div>
          )}
        </Dropdown>
      </div>
    </Sider>
  )
}
