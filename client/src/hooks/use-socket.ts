import constate from 'constate'
import { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useAuthContext } from './use-auth'

export function useSocket() {
  const { user } = useAuthContext()
  const socket = io(ENV.VITE_API_BASE_URL)

  const joinRoom = useCallback(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id)
    }
  }, [socket, user?.id])

  useEffect(
    function joinRoomOnMount() {
      socket.on('connect', joinRoom)

      return () => {
        socket.off('joinRoom', joinRoom)
      }
    },
    [user, socket, joinRoom],
  )

  return { socket }
}

export const [SocketProvider, useSocketContext] = constate(useSocket)
