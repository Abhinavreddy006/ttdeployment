import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLE_ROUTES } from './roles'
import { useAuth } from './useAuth'

function ProtectedRoute({ role }) {
  const { token, user } = useAuth()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== role) {
    return <Navigate to={ROLE_ROUTES[user.role] || '/login'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
