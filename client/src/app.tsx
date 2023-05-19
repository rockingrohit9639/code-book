import { Outlet, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import AuthProtection from './components/auth-protection'
import AppShell from './components/app-shell'

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
    </Routes>
  )
}

export default App
