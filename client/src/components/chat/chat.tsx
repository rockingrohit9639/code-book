import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Result } from 'antd'
import clsx from 'clsx'
import { useQuery, useQueryClient } from 'react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getConversationMessages } from '~/queries/message'
import Loading from '../loading/loading'
import { getErrorMessage } from '~/utils/error'
import { useUser } from '~/hooks/use-user'
import { Message } from '~/types/message'
import { useSocketContext } from '~/hooks/use-socket'
import { getUserConversations } from '~/queries/conversation'
import { BasicUser } from '~/types/user'
import { decrypt, encrypt } from '~/utils/crypto'

type ChatProps = {
  className?: string
  style?: React.CSSProperties
  conversationId: string
}

export default function Chat({ className, style, conversationId }: ChatProps) {
  const [typingUser, setTypingUser] = useState<BasicUser | undefined>(undefined)
  const { socket, activeUsers } = useSocketContext()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const chatEnd = useRef<HTMLDivElement>(null)

  const messages = useQuery(['messages', conversationId], () => getConversationMessages(conversationId))
  const conversations = useQuery(['conversations'], getUserConversations)

  const decryptedMessages = useMemo(() => {
    if (!messages.data) {
      return []
    }

    return messages.data.map((message) => ({
      ...message,
      content: decrypt(message.content),
    }))
  }, [messages.data])

  const conversation = useMemo(() => {
    if (!conversations?.data) {
      return null
    }

    return conversations.data.find((conversation) => conversation.id === conversationId)
  }, [conversationId, conversations.data])

  const usernameToShow = useMemo(() => {
    if (!conversation) {
      return ''
    }

    return `${conversation.users.map((user) => user.username).join(', ')} & ${conversation.createdBy.username}`
  }, [conversation])

  const isUserActive = useMemo(() => {
    if (!conversation) {
      return false
    }

    const allUsers = [...conversation.users, conversation.createdBy].filter((_user) => _user.id !== user.id)

    return allUsers.some((_user) => activeUsers?.map((activeUser) => activeUser.id)?.includes(_user?.id ?? ''))
  }, [activeUsers, conversation, user.id])

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

  const handleScrollIntoView = () => {
    if (chatEnd.current) {
      scrollIntoView(chatEnd.current, { behavior: 'smooth', scrollMode: 'if-needed' })
    }
  }

  const handleNewMessage = useCallback(
    (message: Message) => {
      if (message.fromId !== user.id) {
        const decryptedMessage = decrypt(message.content)
        addNewMessage({ ...message, content: decryptedMessage })
      }
    },
    [addNewMessage, user.id],
  )

  const handleSendMessage = useCallback(
    (values: { content: string }) => {
      const encryptedMessage = encrypt(values.content)
      socket.emit('message', { content: encryptedMessage, conversation: conversationId, from: user.id })

      addNewMessage({
        content: encryptedMessage,
        from: user,
        fromId: user.id,
        id: Date.now().toString(),
      } as unknown as Message)

      handleScrollIntoView()
      form.resetFields()
    },
    [conversationId, user, form, addNewMessage, socket],
  )

  const handleTypingStartEmit = useCallback(() => {
    socket.emit('typingStart', conversationId)
  }, [conversationId, socket])

  const handleTypingUser = useCallback((user: BasicUser) => {
    setTypingUser(user)
  }, [])

  const handleTypingEnd = useCallback(() => {
    setTypingUser(undefined)
  }, [])

  useEffect(
    function handleChattingAndScrollIntoView() {
      socket.emit('joinConversation', conversationId)
      socket.on('message', handleNewMessage)
      socket.on('typing-start', handleTypingUser)
      socket.on('typing-stop', handleTypingEnd)

      window.addEventListener('load', handleScrollIntoView)
      return () => {
        socket.off('message', handleNewMessage)
        socket.off('typing-start', handleTypingUser)
        socket.emit('leaveConversation', conversationId)
        window.removeEventListener('load', handleScrollIntoView)
      }
    },
    [handleNewMessage, socket, handleTypingUser, conversationId, handleTypingEnd],
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
      <div className="flex h-20 flex-col justify-center space-y-1 border-b-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <Avatar className="uppercase">{usernameToShow[0]}</Avatar>
          <div>{usernameToShow}</div>
          {isUserActive ? <div className="h-3 w-3 rounded-full bg-green-600" /> : null}
        </div>
        <div className="text-sm text-gray-500">{typingUser ? `${typingUser.username} is typing...` : null}</div>
      </div>
      <div className="space-y-2 overflow-y-scroll p-4" style={{ height: 'calc(100vh - 160px)' }}>
        {decryptedMessages.map((message) => (
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
              <Input placeholder="What is on your mind?" onFocus={handleTypingStartEmit} />
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
