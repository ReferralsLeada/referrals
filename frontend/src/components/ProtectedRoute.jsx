import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute() {
  const { admin } = useAdminAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsChecking(false);
    }, 100); // allow useEffect in AdminAuthContext to finish
  }, []);

  if (isChecking) return null; // or loading spinner

  if (!admin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
