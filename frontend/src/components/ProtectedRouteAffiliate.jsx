import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRouteAffiliate() {
  const { user, role, loading  } = useAuth();
  
    if (loading) return null;
  if (!user || role !== 'affiliate') {
    return <Navigate to="/affiliate/login" replace />;
  }

  // Optionally, block if not approved (in case someone bypasses frontend logic)
  if (user && user.isApproved === false) {
    return <Navigate to="/affiliate/login" replace />;
  }

  return <Outlet />;
}
