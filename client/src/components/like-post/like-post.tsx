import { useCallback, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { usePosts } from '~/hooks/use-posts'
import { useUser } from '~/hooks/use-user'
import { Post } from '~/types/post'

type LikePostProps = {
  post: Post
}

export default function LikePost({ post }: LikePostProps) {
  const [isPostLiked, setIsPostLiked] = useState<boolean | undefined>()
  const { user } = useUser()
  const { likePostMutation, unLikePostMutation } = usePosts()

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

  return (
    <div className="cursor-pointer" onClick={handleLikeOrUnlike}>
      {isPostLiked ? (
        <AiFillHeart className="text-primary hover:text-primary/50 h-6 w-6" />
      ) : (
        <AiOutlineHeart className="h-6 w-6 hover:text-gray-500" />
      )}
    </div>
  )
}
