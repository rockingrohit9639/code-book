import clsx from 'clsx'
import AppShell from '../app-shell'

type PageProps = {
  className?: string
  style?: React.CSSProperties
  isFullScreen?: boolean
  isHeroSection?: boolean
  children: React.ReactNode
}

export default function Page({ className, style, isFullScreen = false, isHeroSection = true, children }: PageProps) {
  return (
    <div
      className={clsx(!isFullScreen ? 'mx-auto max-w-screen-xl px-8 lg:px-0' : undefined, className)}
      style={{
        ...style,
        marginTop: isHeroSection ? `${AppShell.NAVBAR_HEIGHT}px` : style?.marginTop,
        minHeight: isHeroSection ? `calc(100vh - ${AppShell.NAVBAR_HEIGHT}px)` : style?.minHeight,
      }}
    >
      {children}
    </div>
  )
}
