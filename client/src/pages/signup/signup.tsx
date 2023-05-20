import { Button, Form, Input, InputNumber } from 'antd'
import { Link } from 'react-router-dom'

export default function Signup() {
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

        <Form layout="vertical" className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" />
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
              { type: 'number', min: 99999_99999, message: 'Mobile Number must be greater than 99999_99999!' },
            ]}
          >
            <InputNumber className="!w-full" placeholder="Mobile Number" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button htmlType="submit" type="primary" block>
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
