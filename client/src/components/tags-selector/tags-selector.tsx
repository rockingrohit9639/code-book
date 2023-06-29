import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Select, SelectProps } from 'antd'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useError from '~/hooks/use-error'
import { createTag, fetchAllTags } from '~/queries/tag'
import { Tag } from '~/types/tag'

type TagsSelectorProps = Omit<SelectProps, 'status' | 'options'>

export default function TagsSelector(props: TagsSelectorProps) {
  const [form] = Form.useForm()
  const tags = useQuery(['tags'], fetchAllTags)
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const createTagMutation = useMutation(createTag, {
    onError: handleError,
    onSuccess: (tag) => {
      queryClient.setQueryData<Tag[]>(['tags'], (prev) => {
        if (!prev) return []

        return [tag, ...prev]
      })
      form.resetFields()
    },
  })

  return (
    <Select
      loading={props.loading || tags.isLoading}
      status={tags.error ? 'error' : undefined}
      disabled={props.disabled || tags.isLoading}
      options={tags.data?.map(({ tag }) => ({ label: tag, value: tag }))}
      dropdownRender={(menu) => {
        return (
          <React.Fragment>
            {menu}
            <Divider className="my-4" />
            <Form form={form} className="flex gap-x-2 p-2" onFinish={createTagMutation.mutate}>
              <Form.Item name="tag" className="mb-0 flex-1">
                <Input placeholder="Please enter item" />
              </Form.Item>
              <Button type="text" icon={<PlusOutlined />} htmlType="submit">
                Add item
              </Button>
            </Form>
          </React.Fragment>
        )
      }}
      {...props}
    />
  )
}
