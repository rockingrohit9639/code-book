import { range } from 'lodash'
import AppShell from '~/components/app-shell'
import Page from '~/components/page'
import Post from '~/components/post'

export default function Home() {
  return (
    <Page
      isFullScreen
      className="grid grid-cols-12"
      style={{ marginTop: `${AppShell.NAVBAR_HEIGHT}px`, minHeight: `calc(100vh - ${AppShell.NAVBAR_HEIGHT}px)` }}
    >
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-full space-y-4 border-l-2 border-r-2 p-4 lg:col-span-6">
        {range(5).map((_, idx) => (
          <Post key={idx} />
        ))}
      </div>
      <div className="col-span-3 hidden lg:block" />
    </Page>
  )
}
