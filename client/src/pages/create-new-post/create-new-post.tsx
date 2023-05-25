import { Button, Form, Input, message } from 'antd'
import CodeMirror from '@uiw/react-codemirror'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, useRef } from 'react'
import { useMutation } from 'react-query'
import invariant from 'tiny-invariant'
import Page from '~/components/page/page'
import EditorOptions from './components/editor-options'
import { CODEMIRROR_LANGUAGES, CODEMIRROR_THEMES, EDITOR_SETTINGS } from '~/utils/editor'
import { CreatePostDto } from '~/types/post'
import { componentToImage } from '~/utils/post'
import { createPost } from '~/queries/post'

export default function CreateNewPost() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [form] = Form.useForm()

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      message.success('Post created successfully!')
    },
  })

  const handleCreatePost = useCallback(
    async (dto: Omit<CreatePostDto, 'imageBase64'>) => {
      const editorImage = await componentToImage(editorRef.current)
      invariant(editorImage, 'Editor image is not found!')

      createPostMutation.mutate({
        ...dto,
        imageBase64: editorImage,
      })
    },
    [createPostMutation],
  )

  return (
    <Page className="py-4" isHeroSection>
      <div className="mb-4 border-b pb-4 text-2xl font-bold">Create new post</div>

      <Form
        className="space-y-4"
        layout="vertical"
        form={form}
        initialValues={EDITOR_SETTINGS}
        onFinish={(values) => {
          const dataToSubmit = {
            title: values.title,
            codeSnippet: values.codeSnippet,
          }

          handleCreatePost(dataToSubmit)
        }}
      >
        <Form.Item
          name="title"
          className="mb-0 rounded-md p-4 shadow"
          label="Title"
          rules={[{ required: true, message: 'Title is required!' }]}
        >
          <Input placeholder="Title" />
        </Form.Item>

        <EditorOptions form={form} className="rounded-md p-4 shadow" />

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue, setFieldValue }) => {
            /** Setting the theme on change */
            const selectedTheme = getFieldValue('theme')
            const theme = CODEMIRROR_THEMES[selectedTheme]

            /** Setting the language on change  */
            const selectedLanguage = getFieldValue('language')
            const language = CODEMIRROR_LANGUAGES[selectedLanguage]

            /** Setting the background color on change  */
            const bgColor = getFieldValue('bg-color')

            /** Basic settings of the editor   */
            const settings: any = {}
            for (const key of Object.keys(EDITOR_SETTINGS)) {
              const keyValue = getFieldValue(key)
              if (keyValue !== undefined) {
                settings[key] = keyValue
              }
            }

            return (
              <Form.Item name="codeSnippet">
                <div className="flex items-center justify-center rounded-md border-2 p-4">
                  <div
                    ref={editorRef}
                    className="relative w-max min-w-[40rem] rounded-lg px-10 pb-8 pt-14"
                    style={{
                      backgroundColor: typeof bgColor?.toHexString === 'function' ? bgColor?.toHexString() : bgColor,
                    }}
                  >
                    <img src="/icons/menu-buttons.svg" className="absolute top-5 left-10 w-16 object-contain" />
                    <div className="overflow-hidden rounded-lg">
                      <CodeMirror
                        theme={theme}
                        value={getFieldValue('codeSnippet')}
                        height="100%"
                        extensions={[language()]}
                        basicSetup={{
                          ...settings,
                        }}
                        onChange={(value) => {
                          setFieldValue('codeSnippet', value)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form.Item>
            )
          }}
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          icon={<PlusOutlined />}
          loading={createPostMutation.isLoading}
          disabled={createPostMutation.isLoading}
        >
          Create Post
        </Button>
      </Form>
    </Page>
  )
}
