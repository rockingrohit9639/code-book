import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Result } from 'antd'
import { range } from 'lodash'
import { useEffect, useMemo } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { useQuery } from 'react-query'
import Page from '~/components/page'
import { useAppShellContext } from '~/hooks/use-app-shell'
import { useUser } from '~/hooks/use-user'
import { getUserConversations } from '~/queries/conversation'
import { getErrorMessage } from '~/utils/error'

export default function Messages() {
  const { setIsSiderCollapsed } = useAppShellContext()
  const { user } = useUser()

  const conversations = useQuery(['conversations'], getUserConversations)

  useEffect(
    function collapseSider() {
      setIsSiderCollapsed(true)
    },
    [setIsSiderCollapsed],
  )

  const conversationsContent = useMemo(() => {
    if (conversations.isLoading) {
      return range(6).map((_, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-200"
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300" />
          <div className="space-y-1">
            <div className="h-3 w-20 animate-pulse rounded-sm bg-gray-300" />
            <div className="h-3 w-40 bg-gray-300" />
          </div>
        </div>
      ))
    }

    if (conversations.error) {
      return <Result subTitle={getErrorMessage(conversations.error)} />
    }

    if (conversations.data) {
      return conversations.data.map((conversation) => {
        const userToShow = [!conversation.isGroup, conversation.createdById !== user.id].every(Boolean)
          ? conversation.createdBy
          : conversation.users[0]

        return (
          <div
            key={conversation.id}
            className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-200"
          >
            <Avatar className="uppercase">{userToShow.username[0]}</Avatar>
            <div>
              <div className="">@{userToShow.username}</div>
              <div className="text-sm text-gray-500">Last Message</div>
            </div>
          </div>
        )
      })
    }

    return null
  }, [conversations, user.id])

  return (
    <Page className="grid grid-cols-12">
      <div className="col-span-3 space-y-2 overflow-hidden border-r-2 px-4">
        <div className="flex items-center justify-end p-4">
          <AiOutlineEdit className="h-6 w-6 cursor-pointer" />
        </div>
        <div>Messages</div>
        <div className="space-y-2">{conversationsContent}</div>
      </div>
      <div className="col-span-9 flex flex-col">
        {/* <Empty description="Please select a chat to start conversation" /> */}
        <div className="flex-1" />
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
    </Page>
  )
}
