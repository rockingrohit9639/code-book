import { Result } from 'antd'
import { range } from 'lodash'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Page from '~/components/page'
import Post from '~/components/post'
import useError from '~/hooks/use-error'
import { fetchPosts } from '~/queries/post'

export default function Home() {
  const { getErrorMessage } = useError()
  const posts = useQuery(['posts'], fetchPosts)

  const content = useMemo(() => {
    if (posts.isLoading) {
      return range(5).map((_, idx) => <div key={idx} className="h-96 w-full animate-pulse rounded-2xl bg-gray-300" />)
    }

    if (posts.error) {
      return (
        <Result
          status="500"
          title="Something went wrong while fetching posts"
          subTitle={getErrorMessage(posts.error)}
        />
      )
    }

    return posts?.data?.map((post) => <Post key={post.id} post={post} />)
  }, [posts, getErrorMessage])

  return (
    <Page isFullScreen isHeroSection className="grid grid-cols-12">
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-full space-y-4 border-l-2 border-r-2 p-4 lg:col-span-6">
        <div className="mb-4 flex items-center justify-center rounded-2xl border-2 bg-white p-4">
          <Link to="/create-new-post" className="bg-primary text-background rounded-full px-4 py-2 shadow">
            Create New Post
          </Link>
        </div>

        {content}
      </div>
      <div className="col-span-3 hidden lg:block" />
    </Page>
  )
}
