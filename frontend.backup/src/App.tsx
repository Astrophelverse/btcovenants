
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/auth'

// Pages
import Landing     from './pages/Landing'
import Login       from './pages/Login'
import Signup      from './pages/Signup'
import Onboarding  from './pages/Onboarding'
import Dashboard   from './pages/Dashboard'
import Tickets     from './pages/Tickets'
import TicketView  from './pages/TicketView'
import Deals       from './pages/Deals'
import Profile     from './pages/Profile'
import Settings    from './pages/Settings'
import Docs        from './pages/Docs'
// this is the holder of all files holding up all the imports and urls/ links structural breaks 

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}
// this is the main function that holds all the routes and links to the pages and also the private route for the dashboard and other pages that require authentication
export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: 'oklch(0.07 0.008 260)',
            border: '1px solid oklch(0.15 0.01 260)',
            color: 'oklch(0.95 0.01 260)',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"           element={<Landing />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/docs"       element={<Docs />} />

        {/* Private */}
        <Route path="/dashboard"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tickets"          element={<PrivateRoute><Tickets /></PrivateRoute>} />
        <Route path="/tickets/:id"      element={<PrivateRoute><TicketView /></PrivateRoute>} />
        <Route path="/deals"            element={<PrivateRoute><Deals /></PrivateRoute>} />
        <Route path="/profile"          element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings"         element={<PrivateRoute><Settings /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
