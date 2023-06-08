import { DatePicker, Form, Input, InputNumber, Modal } from 'antd'
import moment from 'moment'
import { cloneElement, useState } from 'react'
import { AiOutlineGithub, AiOutlineGlobal, AiOutlineLinkedin } from 'react-icons/ai'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { fetchProfile, updateProfile } from '~/queries/user'
import { UpdateProfileDto } from '~/types/user'

type UpdateProfileModalProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement<{ onClick: () => void }>
  profileId: string
}

export default function UpdateProfileModal({ className, style, trigger, profileId }: UpdateProfileModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const profile = useQuery(['profile', profileId], () => fetchProfile(profileId))

  const updateProfileMutation = useMutation((dto: UpdateProfileDto) => updateProfile(profileId, dto), {
    onError: handleError,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile', profileId], updatedProfile)
      setIsModalOpen(false)
    },
  })

  return (
    <>
      {cloneElement(trigger, {
        onClick: () => setIsModalOpen(true),
      })}
      <Modal
        width={800}
        className={className}
        style={style}
        title="Update Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
        destroyOnClose
        onOk={form.submit}
        okButtonProps={{
          loading: updateProfileMutation.isLoading,
          disabled: updateProfileMutation.isLoading,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="grid grid-cols-2 gap-x-4"
          onFinish={updateProfileMutation.mutate}
          initialValues={{
            email: profile.data?.email,
            firstName: profile.data?.firstName,
            lastName: profile.data?.lastName,
            mobile: profile.data?.mobile,
            dob: profile.data?.dob ? moment(profile.data.dob) : undefined,
            website: profile.data?.website,
            github: profile.data?.github,
            linkedin: profile.data?.linkedin,
            bio: profile.data?.bio,
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter you email.' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="John" />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
            <Input placeholder="Doe" />
          </Form.Item>

          <Form.Item name="mobile" label="Mobile Number">
            <InputNumber className="!w-full" placeholder="Mobile Number" />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: 'Date of Birth is required' }]}
          >
            <DatePicker placeholder="Date of Birth" className="w-full" />
          </Form.Item>

          <Form.Item name="website" label="Website" rules={[{ type: 'url', message: 'Invalid URL' }]}>
            <Input prefix={<AiOutlineGlobal />} placeholder="https://example.com" />
          </Form.Item>

          <Form.Item name="github" label="Github" rules={[{ type: 'url', message: 'Invalid URL' }]}>
            <Input prefix={<AiOutlineGithub />} placeholder="https://example.com" />
          </Form.Item>

          <Form.Item name="linkedin" label="LinkedIn" rules={[{ type: 'url', message: 'Invalid URL' }]}>
            <Input prefix={<AiOutlineLinkedin />} placeholder="https://example.com" />
          </Form.Item>

          <Form.Item name="bio" label="Bio" className="col-span-2">
            <Input.TextArea rows={4} placeholder="Bio" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
