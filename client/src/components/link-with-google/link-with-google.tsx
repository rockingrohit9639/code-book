import { GoogleOutlined } from '@ant-design/icons'
import { useGoogleLogin } from '@react-oauth/google'
import { Button, ButtonProps, message } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { linkWithGoogle } from '~/queries/auth'
import { UserWithoutSensitiveData } from '~/types/user'

type LinkWithGoogleProps = Omit<ButtonProps, 'onClick'>

export default function LinkWithGoogle(props: LinkWithGoogleProps) {
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const linkWithGoogleMutation = useMutation(linkWithGoogle, {
    onError: handleError,
    onSuccess: (user) => {
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], user)
      message.success('Account linked with google successfully!')
    },
  })

  const login = useGoogleLogin({
    onSuccess: ({ access_token }) => {
      linkWithGoogleMutation.mutate({ access_token })
    },
  })

  return (
    <Button {...props} onClick={login} icon={<GoogleOutlined />}>
      Link with google
    </Button>
  )
}
