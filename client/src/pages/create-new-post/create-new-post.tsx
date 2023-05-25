import { Button, Form, Input } from 'antd'
import CodeMirror from '@uiw/react-codemirror'
import { PlusOutlined } from '@ant-design/icons'
import Page from '~/components/page/page'
import EditorOptions from './components/editor-options'
import { CODEMIRROR_LANGUAGES, CODEMIRROR_THEMES, EDITOR_SETTINGS } from '~/utils/editor'

export default function CreateNewPost() {
  const [form] = Form.useForm()

  return (
    <Page className="py-4" isHeroSection>
      <div className="mb-4 border-b pb-4 text-2xl font-bold">Create new post</div>

      <Form
        className="space-y-4"
        layout="vertical"
        form={form}
        initialValues={EDITOR_SETTINGS}
        onFinish={(values) => {
          console.log(values)
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
              <div className="flex items-center justify-center rounded-md border-2 p-4">
                <div
                  className="relative w-max min-w-[40rem] rounded-lg px-10 pb-8 pt-14"
                  style={{
                    backgroundColor: typeof bgColor?.toHexString === 'function' ? bgColor?.toHexString() : bgColor,
                  }}
                >
                  <img src="/icons/menu-buttons.svg" className="absolute top-5 left-10 w-16 object-contain" />
                  <div className="overflow-hidden rounded-lg">
                    <CodeMirror
                      theme={theme}
                      value={getFieldValue('code')}
                      height="100%"
                      extensions={[language()]}
                      basicSetup={{
                        ...settings,
                      }}
                      onChange={(value) => {
                        setFieldValue('code', value)
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          }}
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          Create Post
        </Button>
      </Form>
    </Page>
  )
}
