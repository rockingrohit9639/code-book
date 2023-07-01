import { message } from 'antd'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '~/components/loading'
import useError from '~/hooks/use-error'
import { linkWithGithub } from '~/queries/auth'
import { UserWithoutSensitiveData } from '~/types/user'

export default function GithubCallback() {
  const { handleError } = useError()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const linkWithGithubMutation = useMutation(linkWithGithub, {
    onError: handleError,
    onSuccess: (user) => {
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], user)
      message.success('Account linked with github successfully!')
      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    if (!code) {
      navigate('/', { replace: true })
      return
    }

    linkWithGithubMutation.mutate({ code })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Loading className="h-screen w-full" />
}
