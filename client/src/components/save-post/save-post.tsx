import { useEffect, useState } from 'react'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { savePost } from '~/queries/user'
import { UserWithoutSensitiveData } from '~/types/user'

type SavePostProps = {
  postId: string
}

export default function SavePost({ postId }: SavePostProps) {
  const [isPostSaved, setIsPostSaved] = useState<boolean | undefined>()

  const { user } = useUser()
  const queryClient = useQueryClient()

  const { handleError } = useError()
  const savePostMutation = useMutation(savePost, {
    onError: handleError,
    onSuccess: (user) => {
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], (prev) => {
        if (!prev) return {} as UserWithoutSensitiveData

        return {
          ...prev,
          savedPostIds:
            user.status === 'SAVED' ? [...prev.savedPostIds, postId] : prev.savedPostIds.filter((id) => id !== postId),
        }
      })
    },
  })

  useEffect(() => {
    setIsPostSaved(user.savedPostIds.includes(postId))
  }, [postId, user.savedPostIds])

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        savePostMutation.mutate(postId)
      }}
    >
      {isPostSaved ? (
        <BsBookmarkFill className="text-primary h-5 w-5" />
      ) : (
        <BsBookmark className="h-5 w-5 hover:text-gray-500" />
      )}
    </div>
  )
}
