import { range } from 'lodash'
import { Link } from 'react-router-dom'
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
        <div className="mb-4 flex items-center justify-center rounded-2xl border-2 p-4">
          <Link to="/create-new-post" className="bg-primary text-background rounded-full px-4 py-2 shadow">
            Create New Post
          </Link>
        </div>

        {range(5).map((_, idx) => (
          <Post key={idx} />
        ))}
      </div>
      <div className="col-span-3 hidden lg:block" />
    </Page>
  )
}
