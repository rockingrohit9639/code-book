import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AiOutlineComment, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { useState } from 'react'
import { useQuery } from 'react-query'
import Comments from './components/comments'
import { Post as PostType } from '~/types/post'
import { fetchFileById } from '~/queries/file'

type PostProps = {
  className?: string
  style?: React.CSSProperties
  post: PostType
}

export default function Post({ className, style, post }: PostProps) {
  const [commentVisible, setCommentVisible] = useState(false)
  const postImage = useQuery(['post-image', post.id], () => fetchFileById(post.imageId))

  return (
    <div className={clsx('overflow-hidden rounded-2xl border-2', className)} id={post.id} style={style}>
      <div className="space-y-2 p-4">
        <Link to={'/profile/userId'} className="text-gray-500">
          @{post.createdBy.username}
        </Link>
        <div>{post.title}</div>
      </div>
      <div className="w-full">
        {postImage.isLoading ? (
          <div className="h-full w-full animate-pulse bg-gray-200" />
        ) : (
          <img src={URL.createObjectURL(postImage.data)} alt="code" className="h-full w-full object-contain" />
        )}
      </div>

      <div className="flex items-center space-x-4 p-4">
        <div className="cursor-pointer">
          <AiOutlineHeart className="h-6 w-6 hover:text-gray-500" />
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            setCommentVisible((prev) => !prev)
          }}
        >
          <AiOutlineComment className="h-6 w-6 hover:text-gray-500" />
        </div>

        <div className="cursor-pointer">
          <AiOutlineShareAlt className="h-6 w-6 hover:text-gray-500" />
        </div>
      </div>

      {commentVisible ? <Comments className="border-t-2" /> : null}
    </div>
  )
}
