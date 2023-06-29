import React from 'react'
import { Layout, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Sidebar from '../sidebar'

type AppShellProps = {
  children: React.ReactElement
}

const SIDEBAR_WIDGET = 250

export default function AppShell({ children }: AppShellProps) {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className="h-screen overflow-hidden">
      <Sidebar />
      <Layout>
        <Content style={{ background: colorBgContainer }} className="overflow-y-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

AppShell.SIDEBAR_WIDTH = SIDEBAR_WIDGET
