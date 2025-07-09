import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api/admin';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = async (email, password) => {
    const response = await loginAdmin({ email, password });
    const adminData = {
      token: response.data.token,
      ...response.data.data.user
    };
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    navigate('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);