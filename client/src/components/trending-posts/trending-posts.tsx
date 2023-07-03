import clsx from 'clsx'
import Post from '../post/post'
import { usePostsContext } from '~/hooks/use-posts'

type TrendingPostsProps = {
  className?: string
  style?: React.CSSProperties
}

export default function TrendingPosts({ className, style }: TrendingPostsProps) {
  const { trendingPosts } = usePostsContext()

  return (
    <div className={clsx(className, 'space-y-4')} style={style}>
      {trendingPosts?.map((post) => (
        <Post key={post.id} incomingPost={post} />
      ))}
    </div>
  )
}
