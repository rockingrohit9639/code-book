import { Button, Form, Input } from 'antd'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div
      className="relative flex h-screen items-center justify-center"
      style={{
        background: 'url("/login-bg-image.jpg")',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg" />
      <div className="relative z-10 w-full max-w-md rounded-md bg-white p-8 shadow">
        <div className="mb-8 text-center">
          <div className="text-lg font-semibold">Login</div>
          <div className="text-content-secondary text-xs font-medium">Login with email and password</div>
        </div>

        <Form layout="vertical" requiredMark={false} className="mb-4">
          <Form.Item hidden name="csrfToken">
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            // loading={signinMutation.isLoading}
            // disabled={signinMutation.isLoading}
          >
            Sign in
          </Button>
        </Form>

        <Link to="/signup">
          <Button block>Sign Up</Button>
        </Link>
      </div>
    </div>
  )
}
