import { Spin } from 'antd'
import clsx from 'clsx'

type LoadingProps = {
  className?: string
  style?: React.CSSProperties
  title?: string
}

export default function Loading({ className, style, title = 'Loading...' }: LoadingProps) {
  return (
    <div className={clsx('flex h-screen items-center justify-center', className)} style={style}>
      <Spin tip={title} />
    </div>
  )
}
