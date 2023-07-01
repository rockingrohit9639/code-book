import { GoogleOutlined } from '@ant-design/icons'
import { useGoogleLogin } from '@react-oauth/google'
import { Button, ButtonProps, message } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { loginWithGoogle } from '~/queries/auth'
import { ENV } from '~/utils/env'

type LoginWithGoogleProps = Omit<ButtonProps, 'onClick'>

export default function LoginWithGoogle(props: LoginWithGoogleProps) {
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const loginWithGoogleMutation = useMutation(loginWithGoogle, {
    onError: handleError,
    onSuccess: ({ user, token }) => {
      message.success('Successfully logged in')
      // save the token in localStorage for further usage
      window.localStorage.setItem(ENV.VITE_BEARER_TOKEN_KEY, token)

      // update the user in the queryClient, so that you would automatically get user from useAuthContext
      queryClient.setQueryData(['logged-in'], user)
    },
  })

  const login = useGoogleLogin({
    onError: () => {
      message.error('Failed to login with Google, please try again later.')
    },
    onSuccess: ({ access_token }) => {
      loginWithGoogleMutation.mutate({ access_token })
    },
  })

  return (
    <Button
      className="w-full"
      icon={<GoogleOutlined />}
      onClick={login}
      loading={loginWithGoogleMutation.isLoading || props.loading}
      disabled={loginWithGoogleMutation.isLoading || props.disabled}
    />
  )
}
