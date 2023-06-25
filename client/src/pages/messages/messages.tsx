import { Avatar, Empty, Result } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash'
import { useEffect, useMemo } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import Chat from '~/components/chat'
import Page from '~/components/page'
import { useAppShellContext } from '~/hooks/use-app-shell'
import { useUser } from '~/hooks/use-user'
import { getUserConversations } from '~/queries/conversation'
import { getErrorMessage } from '~/utils/error'

export default function Messages() {
  const { conversationId } = useParams<{ conversationId: string }>()
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
        <div key={index} className="decoration flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2">
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
          <Link
            to={`/messages/${conversation.id}`}
            key={conversation.id}
            className={clsx(
              'flex cursor-pointer items-center gap-2 rounded-lg border-2 border-transparent px-4 py-2 transition-all delay-75 hover:border-gray-200',
              conversationId === conversation.id && 'border-gray-200',
            )}
          >
            <Avatar className="uppercase">{userToShow.username[0]}</Avatar>
            <div>
              <div className="text-black hover:text-black">@{userToShow.username}</div>
              <div className="text-sm text-gray-500">Last Message</div>
            </div>
          </Link>
        )
      })
    }

    return null
  }, [conversations, user.id, conversationId])

  return (
    <Page className="grid grid-cols-12">
      <div className="col-span-3 space-y-2 overflow-hidden border-r-2 px-4">
        <div className="flex items-center justify-end p-4">
          <AiOutlineEdit className="h-6 w-6 cursor-pointer" />
        </div>
        <div>Messages</div>
        <div className="space-y-2">{conversationsContent}</div>
      </div>
      {conversationId ? (
        <Chat className="col-span-9" conversationId={conversationId} />
      ) : (
        <div className="col-span-9 flex h-full w-full items-center justify-center">
          <Empty description="Please select a chat to start conversation" />
        </div>
      )}
    </Page>
  )
}
