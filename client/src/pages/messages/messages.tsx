import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input } from 'antd'
import { range } from 'lodash'
import { useEffect } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import Page from '~/components/page'
import { useAppShellContext } from '~/hooks/use-app-shell'

export default function Messages() {
  const { setIsSiderCollapsed } = useAppShellContext()

  useEffect(
    function collapseSider() {
      setIsSiderCollapsed(true)
    },
    [setIsSiderCollapsed],
  )

  return (
    <Page className="grid grid-cols-12">
      <div className="col-span-3 space-y-2 border-r-2 px-4">
        <div className="flex items-center justify-end p-4">
          <AiOutlineEdit className="h-6 w-6 cursor-pointer" />
        </div>
        <div>Messages</div>
        {range(6).map((_, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-200"
          >
            <Avatar>R</Avatar>
            <div>
              <div>User {index + 1}</div>
              <div className="text-sm text-gray-500">Last message hai ye</div>
            </div>
          </div>
        ))}
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
