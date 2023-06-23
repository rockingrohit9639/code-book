import clsx from 'clsx'

type PageProps = {
  className?: string
  style?: React.CSSProperties
  isFullScreen?: boolean
  children: React.ReactNode
}

export default function Page({ className, style, isFullScreen = false, children }: PageProps) {
  return (
    <div className={clsx(!isFullScreen ? 'mx-auto min-h-screen max-w-screen-xl' : undefined, className)} style={style}>
      {children}
    </div>
  )
}
