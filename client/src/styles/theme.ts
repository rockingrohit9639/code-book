import { ConfigProvider } from 'antd'
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

type ThemeConfig = React.ComponentProps<typeof ConfigProvider>['theme']

export const ANTD_THEME: ThemeConfig = {
  token: {
    fontSize: 16,
    fontFamily: ['Fira Code', ...defaultTheme.fontFamily.sans].join(', '),

    colorPrimary: '#5701ff',
    colorText: colors.gray['700'],
    colorTextTertiary: colors.gray['500'],

    colorBgBase: '#f3f5f8',
    colorBorder: colors.gray['300'],

    colorError: colors.red['500'],
    colorWarning: colors.yellow['600'],
    colorSuccess: colors.green['600'],

    colorBgContainer: '#f3f5f8',
  },
  components: {
    Form: {
      fontSize: 14,
      margin: 32,
    },
  },
}
