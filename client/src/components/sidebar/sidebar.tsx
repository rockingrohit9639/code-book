import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'
import { Avatar, Dropdown, SiderProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { cloneElement, useMemo } from 'react'
import clsx from 'clsx'
import { useAuthContext } from '../../hooks/use-auth'
import AppShell from '../app-shell/app-shell'
import { ROUTES } from '~/utils/routes'
import { useAppShellContext } from '~/hooks/use-app-shell'

type SidebarProps = SiderProps

export default function Sidebar(props: SidebarProps) {
  const { isSiderCollapsed } = useAppShellContext()
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const activeRoute = useMemo(() => {
    return ROUTES.find((route) => route.type === 'ROUTE' && matchPath(route.path, pathname))
  }, [pathname])

  return (
    <Sider
      width={AppShell.SIDEBAR_WIDTH}
      breakpoint="lg"
      className="fixed left-0 top-0 bottom-0 h-screen overflow-hidden p-4"
      collapsed={isSiderCollapsed}
      {...props}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="text-background mb-4 text-2xl font-bold">{!isSiderCollapsed ? 'Codebook' : null}</div>
          <div className={clsx('flex flex-col space-y-4', isSiderCollapsed && 'items-center')}>
            {ROUTES.map((route) => {
              switch (route.type) {
                case 'ROUTE': {
                  return (
                    <Link
                      to={route.path}
                      key={route.id}
                      className={clsx(
                        'hover:bg-primary h-max w-max rounded px-4 py-2 text-gray-400 hover:text-gray-200',
                        activeRoute?.id === route.id && 'bg-primary text-gray-200',
                      )}
                    >
                      {isSiderCollapsed ? cloneElement(route.icon, { className: 'w-6 h-6' }) : route.item}
                    </Link>
                  )
                }

                case 'REACT_NODE': {
                  return isSiderCollapsed ? route.secondaryItem : route.item
                }

                default: {
                  return null
                }
              }
            })}
          </div>
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
