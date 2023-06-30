import { GoogleLogin } from '@react-oauth/google'
import { message } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { loginWithGoogle } from '~/queries/auth'
import { ENV } from '~/utils/env'

export default function LoginWithGoogle() {
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

  return (
    <div className="flex items-center justify-center">
      <GoogleLogin
        useOneTap
        onSuccess={(result) => {
          if (result?.credential) {
            loginWithGoogleMutation.mutate({ accessToken: result.credential })
          }
        }}
      />
    </div>
  )
}
