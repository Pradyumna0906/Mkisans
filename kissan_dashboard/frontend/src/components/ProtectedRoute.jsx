import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { officer } = useAuth();
  if (!officer) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
