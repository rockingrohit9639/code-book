import { Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import AuthProtection from './components/auth-protection'
import AppShell from './components/app-shell'
import Login from './pages/login/login'

function App() {
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
    </Routes>
  )
}

export default App
