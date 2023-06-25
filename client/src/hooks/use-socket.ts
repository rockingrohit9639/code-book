import constate from 'constate'
import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useAuthContext } from './use-auth'

export function useSocket() {
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
    socket.on('new-user', (user: any) => {
      console.log('New User Detected', user)
    })
  }, [socket])

  return { socket }
}

export const [SocketProvider, useSocketContext] = constate(useSocket)
