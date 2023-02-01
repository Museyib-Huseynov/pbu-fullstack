import { Route, Navigate } from 'react-router-dom'
import { useGlobalUserContext } from '../context/global_user_context'

const ProtectedRoute = ({ children }) => {
  const { user } = useGlobalUserContext()
  return user ? children : <Navigate to='/login' />
}

export default ProtectedRoute
