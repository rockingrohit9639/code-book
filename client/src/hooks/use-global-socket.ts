import { useEffect, useRef } from 'react'
import * as io from 'socket.io-client'
import { ENV } from '~/utils/env'
import { useUser } from './use-user'

/**
 *
 * @param uri a namespace to join
 * @returns a socket io instance to listen all the events and do all other things.
 */

export function useGlobalSocket() {
  const socketRef = useRef<io.Socket | undefined>(undefined)

  const { user } = useUser()

  useEffect(
    function joinRoom() {
      socketRef.current = io.connect(`${ENV.VITE_API_BASE_URL}/global`)

      socketRef.current.emit('joinRoom', `/global/${user.id}`)

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    },
    [user],
  )

  return { socket: socketRef.current }
}
