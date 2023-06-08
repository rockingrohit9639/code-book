import { Outlet, Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { Suspense, lazy } from 'react'
import AuthProtection from './components/auth-protection'
import AppShell from './components/app-shell'
import Login from './pages/login/'
import Signup from './pages/signup'
import { useAuthContext } from './hooks/use-auth'

const CreateNewPost = lazy(() => import('./pages/create-new-post'))
const Home = lazy(() => import('./pages/home'))
const Profile = lazy(() => import('./pages/profile'))

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
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center">
                <Spin tip="Loading please wait..." />
              </div>
            }
          >
            <AuthProtection>
              <AppShell>
                <Outlet />
              </AppShell>
            </AuthProtection>
          </Suspense>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/create-new-post" element={<CreateNewPost />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
