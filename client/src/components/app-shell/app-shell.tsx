import React from 'react'
import Sidebar from '../sidebar'

type AppShellProps = {
  children: React.ReactElement
}

const SIDEBAR_WIDGET = 320

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid grid-cols-12">
      <div className="relative col-span-3 hidden lg:block">
        <Sidebar className="fixed top-0 left-0 h-screen w-80" style={{ width: `${SIDEBAR_WIDGET}px` }} />
      </div>
      <div className="col-span-full space-y-4 border-l-2 border-r-2 lg:col-span-9">{children}</div>
    </div>
  )
}

AppShell.SIDEBAR_WIDTH = SIDEBAR_WIDGET
