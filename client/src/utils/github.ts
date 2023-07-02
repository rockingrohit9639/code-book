import { ENV } from './env'

export function getGitHubUrl(isAuthenticated: boolean = true) {
  const rootURl = 'https://github.com/login/oauth/authorize'

  const options = {
    client_id: ENV.VITE_GITHUB_CLIENT_ID,
    redirect_uri: `${ENV.VITE_GITHUB_REDIRECT_URI}${isAuthenticated ? '' : '/unauthenticated'}`,
    scope: 'user',
  }

  const qs = new URLSearchParams(options)

  return `${rootURl}?${qs.toString()}`
}
