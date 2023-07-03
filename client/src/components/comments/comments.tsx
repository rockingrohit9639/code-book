import { Button, Form, Input } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from 'react-query'
import { useMemo } from 'react'
import { orderBy } from 'lodash'
import { Comment as CommentType, Post } from '~/types/post'
import useError from '~/hooks/use-error'
import { addComment } from '~/queries/post'
import Comment from './components/comment'

type CommentsProps = {
  className?: string
  style?: React.CSSProperties
  postId: string
  comments: CommentType[]
}

export default function Comments({ className, style, comments, postId }: CommentsProps) {
  const [form] = Form.useForm()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation((comment: string) => addComment(postId, comment), {
    onError: handleError,
    onSuccess: (comment) => {
      queryClient.setQueryData<Post[]>(['all-posts'], (prev) => {
        if (!prev) return []

        return prev.map((_post) => {
          if (_post.id === postId) {
            return { ..._post, comments: [comment, ..._post.comments] }
          }

          return _post
        })
      })
      form.resetFields()
    },
  })

  const sortedComments = useMemo(() => {
    return orderBy(comments, (comment) => comment.createdAt, 'desc')
  }, [comments])

  return (
    <div className={className} style={style}>
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
