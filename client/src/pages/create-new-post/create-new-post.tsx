import { Form, Input } from 'antd'
import CodeMirror from '@uiw/react-codemirror'
import Page from '~/components/page/page'
import EditorOptions from './components/editor-options'
import { CODEMIRROR_LANGUAGES, CODEMIRROR_THEMES, EDITOR_SETTINGS } from '~/utils/editor'

export default function CreateNewPost() {
  const [form] = Form.useForm()

  return (
    <Page className="py-4" isHeroSection>
      <div className="mb-4 border-b pb-4 text-2xl font-bold">Create new post</div>

      <Form layout="vertical" form={form} initialValues={EDITOR_SETTINGS}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required!' }]}>
          <Input placeholder="Title" size="large" />
        </Form.Item>

        <EditorOptions form={form} />

        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
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
              <Form.Item name="codeBox">
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
                        value="console.log('hello world!');"
                        height="200px"
                        extensions={[language()]}
                        basicSetup={{
                          ...settings,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Form.Item>
            )
          }}
        </Form.Item>
      </Form>
    </Page>
  )
}
