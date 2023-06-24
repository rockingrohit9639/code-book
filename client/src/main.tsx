import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { QueryClientProvider } from 'react-query'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import App from './app'
import './styles/tailwind.css'
import { ANTD_THEME } from './styles/theme'
import { queryClient } from './utils/client'
import { AuthProvider } from './hooks/use-auth'
import { AppShellProvider } from './hooks/use-app-shell'
import { SocketProvider } from './hooks/use-socket'

dayjs.extend(relativeTime)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConfigProvider theme={ANTD_THEME}>
            <SocketProvider>
              <AppShellProvider>
                <App />
              </AppShellProvider>
            </SocketProvider>
          </ConfigProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
