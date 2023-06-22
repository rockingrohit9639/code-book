import { Avatar, Drawer, Input } from 'antd'
import { cloneElement, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { searchUsers } from '~/queries/user'

type SearchUsersDrawerProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function SearchUsersDrawer({ className, style, trigger }: SearchUsersDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const users = useQuery(['users', `query-${query}`], () => searchUsers(query), { enabled: Boolean(query) })

  return (
    <>
      {cloneElement(trigger, {
        onClick: () => {
          setIsDrawerOpen(true)
        },
      })}
      <Drawer
        className={className}
        style={style}
        open={isDrawerOpen}
        title="Search Users"
        onClose={() => {
          setIsDrawerOpen(false)
        }}
        destroyOnClose
      >
        <div className="space-y-4">
          <Input
            placeholder="Search users"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />

          <div className="space-y-2">
            {users.data?.map((user) => (
              <div
                className="cursor-pointer rounded-lg border-2 px-4 py-2"
                key={user.id}
                onClick={() => {
                  setQuery('')
                  setIsDrawerOpen(false)
                  navigate(`/profile/${user.username}`)
                }}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="uppercase">{user.username[0]}</Avatar>
                  <div>
                    <div>@{user.username}</div>
                    <div className="text-sm text-gray-500">
                      {user.firstName} {user.lastName} {user.followerIds.length} followers
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  )
}
