import { Button, Form, Input } from 'antd'
import clsx from 'clsx'
import { SendOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useMutation, useQueryClient } from 'react-query'
import { useMemo } from 'react'
import { orderBy } from 'lodash'
import { Comment as CommentType, Post } from '~/types/post'
import useError from '~/hooks/use-error'
import { addComment } from '~/queries/post'

type CommentsProps = {
  className?: string
  style?: React.CSSProperties
  postId: string
  comments: CommentType[]
}

function Comment({ comment }: { comment: CommentType }) {
  return (
    <div>
      <div className="text-gray-500">
        @{comment.commentBy.username} - <span className="text-sm">{dayjs(comment.createdAt).fromNow()}</span>
      </div>
      <div>{comment.comment}</div>
    </div>
  )
}

export default function Comments({ className, style, comments, postId }: CommentsProps) {
  const [form] = Form.useForm()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation((comment: string) => addComment(postId, comment), {
    onError: handleError,
    onSuccess: (comment) => {
      queryClient.setQueryData<Post[]>(['posts'], (prev) => {
        if (!prev) return []

        return prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [comment, ...p.comments],
            }
          }
          return p
        })
      })
      form.resetFields()
    },
  })

  const sortedComments = useMemo(() => {
    return orderBy(comments, (comment) => comment.createdAt, 'desc')
  }, [comments])

  return (
    <div className={clsx('p-4', className)} style={style}>
      <Form
        form={form}
        className="mb-4 flex items-center gap-2"
        onFinish={(values) => {
          addCommentMutation.mutate(values.comment)
        }}
      >
        <Form.Item name="comment" rules={[{ required: true, message: 'Please enter comment' }]} noStyle>
          <Input placeholder="Enter Comment" size="large" />
        </Form.Item>
        <Button size="large" icon={<SendOutlined />} htmlType="submit">
          Comment
        </Button>
      </Form>

      <div className="hide-scrollbar max-h-60 space-y-4 overflow-y-auto">
        {sortedComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
