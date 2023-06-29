import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AiFillHeart, AiOutlineComment, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import Comments from '../comments/comments'
import { fetchFileById } from '~/queries/file'
import { useUser } from '~/hooks/use-user'
import SharePost from '../share-post'
import { usePostsContext } from '~/hooks/use-posts'

type PostProps = {
  className?: string
  style?: React.CSSProperties
  postId: string
}

export default function Post({ className, style, postId }: PostProps) {
  const [commentVisible, setCommentVisible] = useState(false)
  const { user } = useUser()
  const [isPostLiked, setIsPostLiked] = useState<boolean | undefined>()
  const { posts, likePostMutation, unLikePostMutation } = usePostsContext()

  const post = useMemo(() => {
    return posts?.find((_post) => _post.id === postId)
  }, [postId, posts])

  const postImage = useQuery(['post-image', post?.id], () => fetchFileById(post?.imageId!), {
    enabled: Boolean(post?.imageId),
  })

  useEffect(
    function checkIsPostLiked() {
      setIsPostLiked(post?.likes?.some((like) => like.likedById === user.id))
    },
    [post, user],
  )

  const handleLikeOrUnlike = useCallback(() => {
    if (!post) return

    if (isPostLiked) {
      unLikePostMutation.mutate(post.id)
    } else {
      likePostMutation.mutate(post.id)
    }
  }, [isPostLiked, post, likePostMutation, unLikePostMutation])

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

      <div className="flex items-center space-x-4">
        <div className="cursor-pointer" onClick={handleLikeOrUnlike}>
          {isPostLiked ? (
            <AiFillHeart className="h-6 w-6 text-red-500 hover:text-red-300" />
          ) : (
            <AiOutlineHeart className="h-6 w-6 hover:text-gray-500" />
          )}
        </div>

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

      <div className="flex items-center space-x-4">
        <div className="text-sm">{post.likes?.length ?? 0} likes</div>
        <div className="text-sm">{post.comments?.length ?? 0} comments</div>
      </div>

      {commentVisible ? <Comments className="border-t-2 pt-2" postId={post.id} comments={post.comments} /> : null}
    </div>
  )
}
