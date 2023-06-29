import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import Comments from '../comments/comments'
import { fetchFileById } from '~/queries/file'
import SharePost from '../share-post'
import { usePostsContext } from '~/hooks/use-posts'
import { Post as PostType } from '~/types/post'
import SavePost from '../save-post'
import LikePost from '../like-post'

type PostProps = {
  className?: string
  style?: React.CSSProperties
  postId?: string
  incomingPost: PostType
}

export default function Post({ className, style, postId, incomingPost }: PostProps) {
  const [commentVisible, setCommentVisible] = useState(false)

  const { posts } = usePostsContext()

  const post = useMemo(() => {
    if (incomingPost) {
      return incomingPost
    }

    return posts?.find((_post) => _post.id === postId)
  }, [postId, posts, incomingPost])

  const postImage = useQuery(['post-image', post?.id], () => fetchFileById(post?.imageId!), {
    enabled: Boolean(post?.imageId),
  })

  if (!post) {
    return <div className="h-96 w-full animate-pulse rounded-2xl bg-gray-300" />
  }

  return (
    <div
      className={clsx('space-y-4 overflow-hidden rounded-2xl border-2 bg-white p-4', className)}
      id={`post-${post.id}`}
      style={style}
    >
      <div className="space-y-2">
        <Link to={`/profile/${post.createdBy.username}`} className="text-gray-500">
          @{post.createdBy.username}
        </Link>
        <div>{post.title}</div>
      </div>

      <div className="w-full">
        {postImage.isLoading ? (
          <div className="h-full w-full animate-pulse bg-gray-200" />
        ) : (
          <Link to={`/post/${post.id}`} className="block">
            <img src={URL.createObjectURL(postImage.data!)} alt="code" className="h-full w-full object-contain" />
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LikePost post={post} />
          <div
            className="cursor-pointer"
            onClick={() => {
              setCommentVisible((prev) => !prev)
            }}
          >
            <AiOutlineComment className="h-6 w-6 hover:text-gray-500" />
          </div>

          <SharePost
            title={post.title}
            postId={post.id}
            trigger={
              <div className="cursor-pointer">
                <AiOutlineShareAlt className="h-6 w-6 hover:text-gray-500" />
              </div>
            }
          />
        </div>
        <SavePost postId={post.id} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm">{post.likes?.length ?? 0} likes</div>
        <div className="text-sm">{post.comments?.length ?? 0} comments</div>
      </div>

      {commentVisible ? <Comments className="border-t-2 pt-2" postId={post.id} comments={post.comments} /> : null}
    </div>
  )
}
