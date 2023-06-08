import { Spin } from 'antd'
import clsx from 'clsx'
import AppShell from '../app-shell/app-shell'

type LoadingProps = {
  className?: string
  style?: React.CSSProperties
  title?: string
}

export default function Loading({ className, style, title = 'Loading...' }: LoadingProps) {
  return (
    <div
      className={clsx('flex items-center justify-center', className)}
      style={{ ...style, minHeight: `calc(100vh - ${AppShell.NAVBAR_HEIGHT})` }}
    >
      <Spin tip={title} />
    </div>
  )
}
