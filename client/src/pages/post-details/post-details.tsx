import { Dropdown, Result } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineCopy, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import Comments from '~/components/comments'
import Loading from '~/components/loading'
import Page from '~/components/page'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { fetchFileById } from '~/queries/file'
import { fetchPostDetails, likePost, unlikePost } from '~/queries/post'
import { Post } from '~/types/post'
import { getErrorMessage } from '~/utils/error'

export default function PostDetails() {
  const [isPostLiked, setIsPostLiked] = useState<boolean | undefined>()
  const { user } = useUser()
  const { id } = useParams() as { id: string }
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const post = useQuery(['post', id], () => fetchPostDetails(id))
  const postImage = useQuery(['post-image', id], () => fetchFileById(post.data?.imageId!), {
    enabled: Boolean(post.data?.imageId),
  })

  const likePostMutation = useMutation(likePost, {
    onError: handleError,
    onSuccess: (like) => {
      queryClient.setQueryData<Post>(['post', id], (prev) => {
        if (!prev) return {} as Post

        return { ...prev, likes: [...prev.likes, like] }
      })
      setIsPostLiked(true)
    },
  })

  const unLikePostMutation = useMutation(unlikePost, {
    onError: handleError,
    onSuccess: (like) => {
      queryClient.setQueryData<Post>(['post', id], (prev) => {
        if (!prev) return {} as Post

        return { ...prev, likes: prev.likes.filter((l) => l.id !== like.id) }
      })
      setIsPostLiked(false)
    },
  })

  useEffect(
    function checkIsPostLiked() {
      setIsPostLiked(post.data?.likes?.some((like) => like.likedById === user.id))
    },
    [post, user],
  )

  const handleLikeOrUnlike = useCallback(() => {
    if (isPostLiked) {
      unLikePostMutation.mutate(id)
    } else {
      likePostMutation.mutate(id)
    }
  }, [isPostLiked, likePostMutation, unLikePostMutation, id])

  if (post.isLoading) {
    return <Loading title="Loading post details..." />
  }

  if (post.error) {
    return <Result subTitle={getErrorMessage(post.error)} />
  }

  return (
    <Page className="space-y-4 py-4">
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div>
          <Link to={`/profile/${post.data?.createdBy.username}`}>@{post.data?.createdBy?.username}</Link>
          <div className="text-sm text-gray-500">
            {post.data?.createdAt ? dayjs(post.data?.createdAt).fromNow() : null}
          </div>
        </div>
        <div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'copyCodeSnippet',
                  label: 'Copy Code Snippet',
                  onClick: () => {
                    navigator.clipboard.writeText(post.data?.codeSnippet ?? '')
                  },
                  icon: <AiOutlineCopy />,
                },
              ],
            }}
          >
            <HiOutlineDotsVertical className="cursor-pointer" />
          </Dropdown>
        </div>
      </div>

      {postImage.data ? (
        <img src={URL.createObjectURL(postImage.data)} alt="code" className="h-full w-full rounded object-contain" />
      ) : null}

      <div className="rounded-lg bg-white shadow-sm">
        <div className="flex items-center space-x-4 p-4">
          <div className="cursor-pointer" onClick={handleLikeOrUnlike}>
            {isPostLiked ? (
              <AiFillHeart className="h-6 w-6 text-red-500 hover:text-red-300" />
            ) : (
              <AiOutlineHeart className="h-6 w-6 hover:text-gray-500" />
            )}
          </div>

          <div className="cursor-pointer">
            <AiOutlineShareAlt className="h-6 w-6 hover:text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-4 px-4">
          <div className="text-sm">{post.data?.likes?.length ?? 0} likes</div>
          <div className="text-sm">{post.data?.comments?.length ?? 0} comments</div>
        </div>

        <Comments
          postId={id}
          comments={post.data?.comments ?? []}
          onCommentSuccess={(comment, queryClient) => {
            queryClient.setQueryData<Post>(['post', id], (prev) => {
              if (!prev) return {} as Post

              return { ...prev, comments: [comment, ...prev.comments] }
            })
          }}
        />
      </div>
    </Page>
  )
}
