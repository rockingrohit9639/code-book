import { useEffect } from 'react'
import * as io from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useUser } from './use-user'

/**
 *
 * @param uri a namespace to join
 * @returns a socket io instance to listen all the events and do all other things.
 */

const socket = io.connect(`${ENV.VITE_API_BASE_URL}/global`)
export function useGlobalSocket() {
  const { user } = useUser()

  useEffect(
    function joinRoom() {
      socket.emit('joinRoom', `/global/${user.id}`)
    },
    [user],
  )

  return { socket }
}
