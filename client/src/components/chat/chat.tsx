import { SendOutlined } from '@ant-design/icons'
import { Button, Form, Input, Result } from 'antd'
import clsx from 'clsx'
import { useQuery } from 'react-query'
import { getConversationMessages } from '~/queries/message'
import Loading from '../loading/loading'
import { getErrorMessage } from '~/utils/error'

type ChatProps = {
  className?: string
  style?: React.CSSProperties
  conversationId: string
}

export default function Chat({ className, style, conversationId }: ChatProps) {
  const messages = useQuery(['messages', conversationId], () => getConversationMessages(conversationId))

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
        <Form className="flex h-full w-full items-center justify-center p-4">
          <div className="flex w-full gap-4">
            <Form.Item name="message" className="w-full" noStyle>
              <Input placeholder="What is on your mind?" />
            </Form.Item>
            <Button icon={<SendOutlined />}>Send</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
