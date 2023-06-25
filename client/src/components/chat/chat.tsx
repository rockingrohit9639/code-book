import { SendOutlined } from '@ant-design/icons'
import { Button, Form, Input, Result } from 'antd'
import clsx from 'clsx'
import { useQuery, useQueryClient } from 'react-query'
import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { getConversationMessages } from '~/queries/message'
import Loading from '../loading/loading'
import { getErrorMessage } from '~/utils/error'
import { useUser } from '~/hooks/use-user'
import { ENV } from '~/utils/env'
import { Message } from '~/types/message'

type ChatProps = {
  className?: string
  style?: React.CSSProperties
  conversationId: string
}

const socket = io(`${ENV.VITE_API_BASE_URL}/messages`)

export default function Chat({ className, style, conversationId }: ChatProps) {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()

  const messages = useQuery(['messages', conversationId], () => getConversationMessages(conversationId))

  const addNewMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<Message[]>(['messages', conversationId], (prevMessages) => {
        if (!prevMessages) {
          return []
        }

        return [...prevMessages, message]
      })
    },
    [queryClient, conversationId],
  )

  const handleSendMessage = useCallback(
    (values: { content: string }) => {
      socket.emit('message', { content: values.content, conversation: conversationId, from: user.id })

      addNewMessage({ content: values.content, from: user.id, id: Date.now().toString() } as unknown as Message)

      form.resetFields()
    },
    [conversationId, user.id, form, addNewMessage],
  )

  useEffect(
    function handleChatting() {
      socket.on('connect', () => {
        socket.emit('joinChatRoom', `/chat/${user.id}`)
      })

      socket.on('message', (message: Message) => {
        addNewMessage(message)
      })

      return () => {
        socket.off()
      }
    },
    [user.id, addNewMessage],
  )

  if (messages.isLoading) {
    return <Loading className="col-span-9" title="Loading Messages..." />
  }

  if (messages.error) {
    return <Result subTitle={getErrorMessage(messages.error)} />
  }

  if (!messages.data) {
    return null
  }

  return (
    <div className={clsx('flex h-full flex-col', className)} style={style}>
      <div className="flex-1">
        {messages.data.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <div className="h-20 border-t-2">
        <Form form={form} className="flex h-full w-full items-center justify-center p-4" onFinish={handleSendMessage}>
          <div className="flex w-full gap-4">
            <Form.Item name="content" className="w-full" rules={[{ required: true, message: 'Please enter message!' }]}>
              <Input placeholder="What is on your mind?" />
            </Form.Item>
            <Button icon={<SendOutlined />} htmlType="submit" type="primary">
              Send
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
