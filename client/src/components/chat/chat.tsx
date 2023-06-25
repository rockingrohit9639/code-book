import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Result } from 'antd'
import clsx from 'clsx'
import { useQuery, useQueryClient } from 'react-query'
import { useCallback, useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getConversationMessages } from '~/queries/message'
import Loading from '../loading/loading'
import { getErrorMessage } from '~/utils/error'
import { useUser } from '~/hooks/use-user'
import { Message } from '~/types/message'
import { useSocketContext } from '~/hooks/use-socket'

type ChatProps = {
  className?: string
  style?: React.CSSProperties
  conversationId: string
}

export default function Chat({ className, style, conversationId }: ChatProps) {
  const { socket } = useSocketContext()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const chatEnd = useRef<HTMLDivElement>(null)

  const messages = useQuery(['messages', conversationId], () => getConversationMessages(conversationId))

  const addNewMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<Message[]>(['messages', conversationId], (prevMessages) => {
        if (!prevMessages) {
          return []
        }

        return [...prevMessages, message]
      })

      if (chatEnd.current) {
        scrollIntoView(chatEnd.current, { behavior: 'smooth', scrollMode: 'if-needed' })
      }
    },
    [queryClient, conversationId],
  )

  const handleSendMessage = useCallback(
    (values: { content: string }) => {
      socket.emit('message', { content: values.content, conversation: conversationId, from: user.id })

      addNewMessage({
        content: values.content,
        from: user,
        fromId: user.id,
        id: Date.now().toString(),
      } as unknown as Message)

      form.resetFields()
    },
    [conversationId, user, form, addNewMessage, socket],
  )

  useEffect(
    function handleChattingAndScrollIntoView() {
      if (chatEnd.current) {
        scrollIntoView(chatEnd.current, { behavior: 'smooth', scrollMode: 'if-needed' })
      }

      socket.on('message', addNewMessage)

      return () => {
        socket.off('message', addNewMessage)
      }
    },
    [user.id, addNewMessage, socket],
  )

  useEffect(
    function joinConversation() {
      socket.emit('joinConversation', conversationId)

      return () => {
        socket.emit('leaveConversation', conversationId)
      }
    },
    [conversationId, socket],
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
      <div className="space-y-2 overflow-y-scroll p-4" style={{ height: 'calc(100vh - 80px)' }}>
        {messages.data.map((message) => (
          <div
            key={message.id}
            className={clsx('flex items-end gap-1', message.fromId === user.id && 'flex-row-reverse')}
          >
            <Avatar className="uppercase" size="small">
              {message.from.username[0]}
            </Avatar>
            <div
              className={clsx(
                'w-max rounded-full px-4 py-1 text-white',
                message.fromId === user.id ? 'bg-gray-500' : 'bg-primary',
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={chatEnd} className="h-4" />
      </div>
      <div className="h-20 border-t-2">
        <Form form={form} className="flex h-full w-full items-center justify-center p-4" onFinish={handleSendMessage}>
          <div className="flex w-full gap-4">
            <Form.Item name="content" className="w-full" rules={[{ required: true, message: 'Please enter message!' }]}>
              <Input placeholder="What is on your mind?" autoFocus />
            </Form.Item>
            <Form.Item noStyle dependencies={['content']}>
              {({ getFieldValue }) => {
                return (
                  <Button icon={<SendOutlined />} htmlType="submit" type="primary" disabled={!getFieldValue('content')}>
                    Send
                  </Button>
                )
              }}
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  )
}
