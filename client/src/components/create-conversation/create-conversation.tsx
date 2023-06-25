import { cloneElement } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import useError from '~/hooks/use-error'
import { createConversation } from '~/queries/conversation'

type CreateConversationProps = {
  userIds: string[]
  trigger: React.ReactElement<{ onClick: () => void }>
}

export default function CreateConversation({ trigger, userIds }: CreateConversationProps) {
  const { handleError } = useError()
  const navigate = useNavigate()

  const createConversationMutation = useMutation(createConversation, {
    onError: handleError,
    onSuccess: (conversation) => {
      navigate(`/messages/${conversation.id}`)
    },
  })

  return cloneElement(trigger, {
    onClick: () => {
      createConversationMutation.mutate({ users: userIds })
    },
  })
}
