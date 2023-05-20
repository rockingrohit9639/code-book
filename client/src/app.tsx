import { Outlet, Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import Home from './pages/home'
import AuthProtection from './components/auth-protection'
import AppShell from './components/app-shell'
import Login from './pages/login/'
import Signup from './pages/signup'
import { useAuthContext } from './hooks/use-auth'

function App() {
  const { authVerificationInProgress } = useAuthContext()

  if (authVerificationInProgress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin tip="Authenticating User..." />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        element={
          <AuthProtection>
            <AppShell>
              <Outlet />
            </AppShell>
          </AuthProtection>
        }
      >
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
