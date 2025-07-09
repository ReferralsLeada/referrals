import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminList, signupAffiliate } from '../../api/affiliate';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';

export default function AffiliateSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    adminId: ''
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUser, setRole } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdminList();
        setAdmins(response.data.data.admins);
      } catch (err) {
        setError('Failed to load admin list');
      }
    };
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signupAffiliate(formData);
      const userData = {
        ...response.data.data.affiliate,
        token: response.data.token
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', 'affiliate');
      setUser(userData);
      setRole('affiliate');
      navigate('/affiliate/dashboard');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <Navbar />
      <div className="flex justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-3xl font-extrabold text-center mb-4">Affiliate Signup</h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Select Admin</label>
              <select
                value={formData.adminId}
                onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                required
              >
                <option value="">Select an admin</option>
                {admins.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} ({admin.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-md transition-transform transform hover:scale-105"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <span
                className="text-green-600 hover:underline cursor-pointer"
                onClick={() => navigate('/affiliate/login')}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
