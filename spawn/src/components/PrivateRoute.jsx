import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/authService';

// Component for private routes - will redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin" replace />;
};

export default PrivateRoute; 