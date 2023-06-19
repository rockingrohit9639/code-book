import { Dropdown } from 'antd'
import dayjs from 'dayjs'
import { AiOutlineDelete } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { deleteComment } from '~/queries/post'
import { Comment as CommentType, Post } from '~/types/post'

type CommentProps = {
  comment: CommentType
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const deleteCommentMutation = useMutation(deleteComment, {
    onError: handleError,
    onSuccess: (comment) => {
      queryClient.setQueryData<Post[]>(['posts'], (prev) => {
        if (!prev) return []

        return prev.map((p) => {
          if (p.id === comment.postId) {
            return {
              ...p,
              comments: p.comments.filter((l) => l.id !== comment.id),
            }
          }
          return p
        })
      })
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-gray-500">
          @{comment.commentBy.username} - <span className="text-sm">{dayjs(comment.createdAt).fromNow()}</span>
        </div>
        {user.id === comment.commentById ? (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'delete-comment',
                  label: 'Delete',
                  icon: <AiOutlineDelete />,
                  danger: true,
                  onClick: () => deleteCommentMutation.mutate(comment.id),
                },
              ],
            }}
          >
            <HiOutlineDotsVertical className="cursor-pointer" />
          </Dropdown>
        ) : null}
      </div>
      <div>{comment.comment}</div>
    </div>
  )
}
