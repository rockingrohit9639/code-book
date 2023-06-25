import constate from 'constate'
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useAuthContext } from './use-auth'
import { User } from '~/types/user'

export function useSocket() {
  const [activeUsers, setActiveUsers] = useState<User[] | undefined>()
  const { user } = useAuthContext()
  const accessToken = localStorage.getItem(ENV.VITE_BEARER_TOKEN_KEY)

  const socket = io(ENV.VITE_API_BASE_URL, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  })

  const joinRoom = useCallback(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id)
    }
  }, [socket, user?.id])

  const handleNewUser = useCallback(
    (newUser: User) => {
      if (!activeUsers?.find((user) => user.id === newUser.id)) {
        setActiveUsers((prevUsers) => [...(prevUsers ?? []), newUser])
      }
    },
    [activeUsers],
  )

  useEffect(
    function joinRoomOnMount() {
      if (user?.id) {
        socket.on('connect', joinRoom)
      }

      return () => {
        socket.off('joinRoom', joinRoom)
      }
    },
    [user, socket, joinRoom],
  )

  useEffect(() => {
    socket.on('new-user', handleNewUser)

    return () => {
      socket.off('new-user', handleNewUser)
    }
  }, [socket, handleNewUser])

  return { socket, activeUsers }
}

export const [SocketProvider, useSocketContext] = constate(useSocket)
