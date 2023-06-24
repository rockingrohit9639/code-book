import constate from 'constate'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useAuthContext } from './use-auth'

export function useSocket() {
  const { user } = useAuthContext()
  const socket = io(`${ENV.VITE_API_BASE_URL}/global`)

  useEffect(
    function joinRoom() {
      socket.on('connect', () => {
        if (user?.id) {
          socket.emit('joinRoom', `/global/${user.id}`)
        }
      })
    },
    [user, socket],
  )

  return { socket }
}

export const [SocketProvider, useSocketContext] = constate(useSocket)
