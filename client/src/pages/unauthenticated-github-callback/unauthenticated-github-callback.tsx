import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '~/components/loading'
import useError from '~/hooks/use-error'
import { loginWithGithub } from '~/queries/auth'
import { ENV } from '~/utils/env'

export default function UnauthenticatedGithubCallback() {
  const { handleError } = useError()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const loginWithGithubMutation = useMutation(loginWithGithub, {
    onError: handleError,
    onSuccess: ({ user, token }) => {
      // save the token in localStorage for further usage
      window.localStorage.setItem(ENV.VITE_BEARER_TOKEN_KEY, token)

      // update the user in the queryClient, so that you would automatically get user from useAuthContext
      queryClient.setQueryData(['logged-in'], user)

      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    if (!code) {
      navigate('/', { replace: true })
      return
    }

    loginWithGithubMutation.mutate({ code })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Loading className="h-screen w-full" />
}
