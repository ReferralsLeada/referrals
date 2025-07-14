// 






import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAffiliate } from '../api/affiliate';
import { loginAdmin } from '../api/admin';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedRole = localStorage.getItem('role');
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType) => {
    try {
      let response;

      if (userType === 'admin') {
        response = await loginAdmin({ email, password });
      } else if (userType === 'affiliate') {
        response = await loginAffiliate({ email, password });
      } else {
        throw new Error('Invalid user type');
      }

      const userData = {
        ...(response.data.user || response.data.affiliate),
        token: response.data.token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userType);
      setUser(userData);
      setRole(userType);

      // ✅ Navigate based on role
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/affiliate/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
