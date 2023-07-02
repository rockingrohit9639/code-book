import { Button, Form, Input } from 'antd'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'
import { useAuthContext } from '../../hooks/use-auth'
import LoginWithGoogle from '~/components/login-with-google'
import { getGitHubUrl } from '~/utils/github'

export default function Login() {
  const { user, loginMutation } = useAuthContext()

  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  if (user) {
    return <Navigate to={{ pathname: redirectTo }} replace />
  }

  return (
    <div
      className="relative flex h-screen items-center justify-center"
      style={{
        background: 'url("/bg-image.jpg")',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg" />
      <div className="relative z-10 w-full max-w-md space-y-4 rounded-md bg-white p-8 shadow">
        <div className="text-center">
          <div className="text-lg font-semibold">Login</div>
          <div className="text-primary text-xs font-medium">Welcome Back</div>
        </div>

        <Form
          layout="vertical"
          onFinish={(values) => {
            loginMutation.mutate(values)
          }}
        >
          <Form.Item
            name="usernameOrEmail"
            label="Username or Email"
            rules={[{ required: true, message: 'Username or email  is required' }]}
          >
            <Input placeholder="Username or Email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            loading={loginMutation.isLoading}
            disabled={loginMutation.isLoading}
          >
            Sign in
          </Button>
        </Form>

        <div className="flex items-center justify-center space-x-2">
          <LoginWithGoogle />
          <Button
            icon={<GithubOutlined />}
            onClick={() => {
              window.location.href = getGitHubUrl(false)
            }}
          />
        </div>

        <Link to="/signup" className="block">
          <Button block>Did not have an account ?</Button>
        </Link>
      </div>
    </div>
  )
}
