import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './app'
import './styles/tailwind.css'
import { ANTD_THEME } from './styles/theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={ANTD_THEME}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
