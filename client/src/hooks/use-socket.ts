import constate from 'constate'
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useAuthContext } from './use-auth'
import { UserWithoutSensitiveData } from '~/types/user'

export function useSocket() {
  const [activeUsers, setActiveUsers] = useState<UserWithoutSensitiveData[] | undefined>()
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
    (newUser: UserWithoutSensitiveData) => {
      if (!activeUsers?.find((user) => user.id === newUser.id)) {
        setActiveUsers((prevUsers) => [...(prevUsers ?? []), newUser])
      }
    },
    [activeUsers],
  )

  const handleRemoveUser = useCallback((removedUser: UserWithoutSensitiveData) => {
    setActiveUsers((prevUsers) => prevUsers?.filter((user) => user.id !== removedUser.id))
  }, [])

  useEffect(
    function joinRoomOnMount() {
      if (user?.id) {
        socket.on('connect', joinRoom)
      }

      return () => {
        socket.off('joinRoom', joinRoom)
        // if (socket.active && user?.id) {
        //   socket.emit('leaveRoom', user.id)
        // }
      }
    },
    [user, socket, joinRoom],
  )

  useEffect(() => {
    socket.on('new-user', handleNewUser)
    socket.on('user-left', handleRemoveUser)

    return () => {
      socket.off('new-user', handleNewUser)
      socket.off('user-left', handleRemoveUser)
    }
  }, [socket, handleNewUser, handleRemoveUser])

  return { socket, activeUsers }
}

export const [SocketProvider, useSocketContext] = constate(useSocket)
