import { Modal } from 'antd'
import { cloneElement, useCallback } from 'react'
import { useMutation } from 'react-query'
import useError from '~/hooks/use-error'
import { deletePost } from '~/queries/post'
import { Post } from '~/types/post'

type DeletePostModalProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
  onSuccess?: (post: Post) => void
  postId: string
}

export default function DeletePostModal({ trigger, onSuccess, postId }: DeletePostModalProps) {
  const { handleError } = useError()

  const deletePostMutation = useMutation(deletePost, {
    onError: handleError,
    onSuccess,
  })

  const handlePostDelete = useCallback(() => {
    Modal.confirm({
      title: 'Are you sure you want to delete this post?',
      type: 'error',
      onOk: () => {
        deletePostMutation.mutate(postId)
      },
    })
  }, [deletePostMutation, postId])

  return cloneElement(trigger, {
    onClick: handlePostDelete,
  })
}
