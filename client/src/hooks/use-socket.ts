import { useEffect } from 'react'
import * as io from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useUser } from './use-user'

export function useSocket(uri: string = '/') {
  const socket = io.connect(`${ENV.VITE_API_BASE_URL}${uri}`)
  const { user } = useUser()

  useEffect(
    function joinRoom() {
      socket.emit('joinRoom', `notification/${user.id}`)
    },
    [socket, user],
  )

  return { socket }
}
