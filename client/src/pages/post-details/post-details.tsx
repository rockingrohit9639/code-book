import { Dropdown, Result, Tag, message } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { AiOutlineCopy, AiOutlineDelete, AiOutlineShareAlt } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { useQuery } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import randomColor from 'randomcolor'
import Comments from '~/components/comments'
import DeletePostModal from '~/components/delete-post-modal'
import Loading from '~/components/loading'
import Page from '~/components/page'
import SharePost from '~/components/share-post'
import { usePostsContext } from '~/hooks/use-posts'
import { useUser } from '~/hooks/use-user'
import { fetchFileById } from '~/queries/file'
import { getErrorMessage } from '~/utils/error'
import LikePost from '~/components/like-post'

export default function PostDetails() {
  const { user } = useUser()
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const { posts, isLoading, error } = usePostsContext()

  const post = useMemo(() => {
    return posts?.find((p) => p.id === id)
  }, [posts, id])

  const postImage = useQuery(['post-image', id], () => fetchFileById(post?.imageId!), {
    enabled: Boolean(post?.imageId),
  })

  const dropdownItems = useMemo(() => {
    const items: ItemType[] = [
      {
        key: 'copyCodeSnippet',
        label: 'Copy Code Snippet',
        onClick: () => {
          navigator.clipboard.writeText(post?.codeSnippet ?? '')
          message.success('Code copied to clipboard successfully!')
        },
        icon: <AiOutlineCopy />,
      },
    ]

    if (user.id === post?.createdById) {
      items.push({
        key: 'delete-post',
        label: (
          <DeletePostModal
            postId={post.id}
            trigger={<div>Delete Post</div>}
            onSuccess={() => {
              navigate('/', { replace: true })
            }}
          />
        ),
        danger: true,
        icon: <AiOutlineDelete />,
      })
    }

    return items
  }, [post, user, navigate])

  if (isLoading) {
    return <Loading className="h-screen" title="Loading post details..." />
  }

  if (error) {
    return <Result subTitle={getErrorMessage(error)} />
  }

  return (
    <Page className="space-y-4 p-4">
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div>
          <Link to={`/profile/${post?.createdBy.username}`}>@{post?.createdBy?.username}</Link>
          <div className="text-sm text-gray-500">{post?.createdAt ? dayjs(post?.createdAt).fromNow() : null}</div>
        </div>
        <div>
          <Dropdown
            trigger={['click']}
            menu={{
              items: dropdownItems,
            }}
          >
            <HiOutlineDotsVertical className="cursor-pointer" />
          </Dropdown>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm">
        {post?.tags.map((tag) => (
          <Tag key={tag} color={randomColor()}>
            {tag}
          </Tag>
        ))}
      </div>

      {postImage.data ? (
        <div className="space-y-2 rounded-lg bg-white px-2 py-4 shadow-sm">
          <div>{post?.title}</div>
          <img src={URL.createObjectURL(postImage.data)} alt="code" className="h-full w-full rounded object-contain" />
        </div>
      ) : null}

      <div className="rounded-lg bg-white shadow-sm">
        <div className="space-y-2 p-4">
          <div className="flex items-center space-x-4">
            {post ? <LikePost post={post} /> : null}

            <SharePost
              title={post?.title ?? ''}
              postId={post?.id ?? ''}
              trigger={
                <div className="cursor-pointer">
                  <AiOutlineShareAlt className="h-6 w-6 hover:text-gray-500" />
                </div>
              }
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">{post?.likes?.length ?? 0} likes</div>
            <div className="text-sm">{post?.comments?.length ?? 0} comments</div>
          </div>
        </div>

        <Comments className="p-4" postId={id} comments={post?.comments ?? []} />
      </div>
    </Page>
  )
}
