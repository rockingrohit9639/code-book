import AppShell from '~/components/app-shell'
import Page from '~/components/page'

export default function Home() {
  return (
    <Page
      isFullScreen
      className="grid grid-cols-12"
      style={{ marginTop: `${AppShell.NAVBAR_HEIGHT}px`, minHeight: `calc(100vh - ${AppShell.NAVBAR_HEIGHT}px)` }}
    >
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-full border-l-2 border-r-2 p-4 lg:col-span-6 ">This is homepage</div>
      <div className="col-span-3 hidden lg:block" />
    </Page>
  )
}
