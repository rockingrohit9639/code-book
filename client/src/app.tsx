import { Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import AuthProtection from './components/auth-protection'
import AppShell from './components/app-shell'
import Login from './pages/login/'
import Signup from './pages/signup'

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
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
