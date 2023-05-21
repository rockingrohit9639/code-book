import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AiOutlineComment, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai'
import { useUser } from '~/hooks/use-user'

type PostProps = {
  className?: string
  style?: React.CSSProperties
}

export default function Post({ className, style }: PostProps) {
  const { user } = useUser()

  return (
    <div className={clsx('overflow-hidden rounded-2xl border-2', className)} style={style}>
      <div className="space-y-2 border-b p-4">
        <Link to={'/profile/userId'} className="text-gray-500">
          @{user.username}
        </Link>
        <div>This is testing post</div>
      </div>
      <div className="h-[30rem] w-full">
        <img src="/code.png" alt="code" className="h-full w-full object-cover" />
      </div>

      <div className="flex items-center space-x-4 p-4">
        <div className="cursor-pointer">
          <AiOutlineHeart className="h-6 w-6 hover:text-gray-500" />
        </div>

        <div className="cursor-pointer">
          <AiOutlineComment className="h-6 w-6 hover:text-gray-500" />
        </div>

        <div className="cursor-pointer">
          <AiOutlineShareAlt className="h-6 w-6 hover:text-gray-500" />
        </div>
      </div>
    </div>
  )
}
