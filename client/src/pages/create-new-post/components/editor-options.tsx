import { SettingOutlined } from '@ant-design/icons'
import { Button, Checkbox, ColorPicker, Dropdown, Form, FormInstance, Select, theme } from 'antd'
import clsx from 'clsx'
import { useCallback } from 'react'
import { CODEMIRROR_LANGUAGES, CODEMIRROR_THEMES, DEFAULT_THEMES, EDITOR_SETTINGS } from '~/utils/editor'
import { camelToNormalCase } from '~/utils/format'

type EditorOptionsProps = {
  className?: string
  style?: React.CSSProperties
  form: FormInstance<any>
}

export default function EditorOptions({ className, style, form }: EditorOptionsProps) {
  const { token } = theme.useToken()

  const handleDefaultThemeChange = useCallback(
    (theme: string, bgColor: string) => {
      form.setFieldsValue({
        'bg-color': bgColor,
        theme,
      })
    },
    [form],
  )

  return (
    <div className={clsx('flex items-center gap-4', className)} style={style}>
      <Form.Item
        name="theme"
        label="Theme"
        rules={[{ required: true, message: 'Theme is required!' }]}
        initialValue="Abcdef"
        className="w-48"
      >
        <Select
          showSearch
          placeholder="Select Theme"
          options={Object.keys(CODEMIRROR_THEMES).map((key) => ({ label: key, value: key }))}
        />
      </Form.Item>

      <Form.Item
        name="language"
        label="Language"
        rules={[{ required: true, message: 'Language is required!' }]}
        className="w-48"
        initialValue="JavaScript"
      >
        <Select
          showSearch
          placeholder="Select Language"
          options={Object.keys(CODEMIRROR_LANGUAGES).map((key) => ({ label: key, value: key }))}
        />
      </Form.Item>

      <Form.Item
        name="bg-color"
        label="Background Color"
        rules={[{ required: true, message: 'Background Color is required!' }]}
        className="w-48"
        initialValue={token.colorPrimary}
      >
        <ColorPicker format="hex" />
      </Form.Item>

      <Form.Item label="Settings">
        <Dropdown
          overlayClassName="h-96 overflow-y-auto"
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'default-themes',
                label: (
                  <div className="flex w-80 items-center gap-2 overflow-x-scroll">
                    {DEFAULT_THEMES.map((defaultTheme) => (
                      <img
                        key={defaultTheme.bgColor}
                        src={defaultTheme.image}
                        className="w-28"
                        onClick={() => handleDefaultThemeChange(defaultTheme.themeName, defaultTheme.bgColor)}
                      />
                    ))}
                  </div>
                ),
              },
              ...Object.keys(EDITOR_SETTINGS).map((key) => ({
                key,
                label: (
                  <Form.Item name={key} noStyle>
                    <Checkbox
                      key={key}
                      checked={form.getFieldValue(key)}
                      onChange={(e) => {
                        form.setFieldValue(key, e.target.checked)
                      }}
                    >
                      {camelToNormalCase(key)}
                    </Checkbox>
                  </Form.Item>
                ),
              })),
            ],
          }}
        >
          <Button icon={<SettingOutlined />} />
        </Dropdown>
      </Form.Item>
    </div>
  )
}
