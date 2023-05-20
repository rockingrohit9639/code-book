import { Button, Form, Input, InputNumber } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PASSWORD_REGEX } from '../../utils/constants'
import { isEmailExists, isUsernameExists, signUp } from '../../queries/auth'
import { useDebounce } from '../../hooks/use-debounce'
import useError from '../../hooks/use-error'
import { ENV } from '../../utils/env'
import { SignupDto } from '../../types/auth'
import { useAuthContext } from '../../hooks/use-auth'

export default function Signup() {
  const { user } = useAuthContext()

  const [form] = Form.useForm<SignupDto>()

  const usernameValue = Form.useWatch('username', form)
  const emailValue = Form.useWatch('email', form)
  const username = useDebounce(usernameValue, 1000)
  const email = useDebounce(emailValue, 1000)

  const { handleError } = useError()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const isUsernameExistsQ = useQuery(['is-username-exists', `username-${username}`], () => isUsernameExists(username), {
    enabled: Boolean(username),
    onSuccess: (isExists) => {
      if (isExists) {
        form.setFields([{ name: 'username', errors: ['Username already exists'] }])
      }
    },
  })

  const isEmailExistsQ = useQuery(['is-email-exists', `email-${email}`], () => isEmailExists(email), {
    enabled: Boolean(email),
    onSuccess: (isExists) => {
      if (isExists) {
        form.setFields([{ name: 'email', errors: ['Email already exists'] }])
      }
    },
  })

  const signupMutation = useMutation(signUp, {
    onError: handleError,
    onSuccess: ({ user, token }) => {
      // saving the token
      localStorage.setItem(ENV.VITE_BEARER_TOKEN_KEY, token)

      // setting the user in state
      queryClient.setQueryData(['logged-in'], user)

      navigate('/', { replace: true })
    },
  })

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <div
      className="relative flex h-screen items-center justify-center p-4 md:p-0"
      style={{
        background: 'url("/bg-image.jpg")',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg" />
      <div className="relative z-10 w-full max-w-4xl rounded-md bg-white p-8 shadow">
        <div className="mb-8 text-center text-lg font-semibold">
          Signup for <span className="text-primary">C</span>odebook
        </div>

        <Form
          form={form}
          layout="vertical"
          className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2"
          onFinish={(values) => {
            signupMutation.mutate(values)
          }}
        >
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input placeholder="Username" disabled={isUsernameExistsQ.isLoading} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" disabled={isEmailExistsQ.isLoading} />
          </Form.Item>

          <Form.Item name="firstName" label="First Name">
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name">
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { type: 'number', min: 10000_00000, message: 'Mobile Number must be greater than 10000_00000!' },
              { type: 'number', max: 99999_99999, message: 'Mobile Number must be less than 99999_99999!' },
            ]}
          >
            <InputNumber className="!w-full" placeholder="Mobile Number" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { pattern: PASSWORD_REGEX, message: 'Password is too weak!' },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            loading={signupMutation.isLoading}
            disabled={signupMutation.isLoading}
          >
            Sign Up
          </Button>
        </Form>

        <Link to="/login" className="flex justify-center md:justify-end">
          <Button type="link">Already have an account ?</Button>
        </Link>
      </div>
    </div>
  )
}
