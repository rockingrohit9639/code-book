import { Result, Tabs } from 'antd'
import { range } from 'lodash'
import { useEffect, useMemo } from 'react'
import { HiTrendingUp } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { MdOutlineFeed } from 'react-icons/md'
import Page from '~/components/page'
import Post from '~/components/post'
import TrendingPosts from '~/components/trending-posts'
import { useAppShellContext } from '~/hooks/use-app-shell'
import useError from '~/hooks/use-error'
import { usePosts } from '~/hooks/use-posts'

export default function Home() {
  const { setIsSiderCollapsed } = useAppShellContext()
  const { posts, isLoading, error } = usePosts()
  const { getErrorMessage } = useError()

  useEffect(
    function openSider() {
      setIsSiderCollapsed(false)
    },
    [setIsSiderCollapsed],
  )

  const content = useMemo(() => {
    if (isLoading) {
      return range(5).map((_, idx) => <div key={idx} className="h-96 w-full animate-pulse rounded-2xl bg-gray-300" />)
    }

    if (error) {
      return <Result status="500" title="Something went wrong while fetching posts" subTitle={getErrorMessage(error)} />
    }

    return (
      <Tabs>
        <Tabs.TabPane
          key="feed"
          tab={
            <div className="flex items-center gap-2">
              <MdOutlineFeed />
              <div>Feed</div>
            </div>
          }
        >
          {posts?.map((post) => (
            <Post key={post.id} postId={post.id} />
          ))}
        </Tabs.TabPane>

        <Tabs.TabPane
          key="trending"
          tab={
            <div className="flex items-center gap-2">
              <HiTrendingUp className="h-6 w-6" />
              <div>Trending</div>
            </div>
          }
        >
          <TrendingPosts />
        </Tabs.TabPane>
      </Tabs>
    )
  }, [isLoading, error, getErrorMessage, posts])

  return (
    <Page className="grid grid-cols-6">
      <div className="col-span-4 space-y-4 border-r-2 p-4">
        <div className="mb-4 flex items-center justify-center rounded-2xl border-2 bg-white p-4">
          <Link to="/create-new-post" className="bg-primary text-background rounded-full px-4 py-2 shadow">
            Create New Post
          </Link>
        </div>

        {content}
      </div>
      <div />
    </Page>
  )
}
