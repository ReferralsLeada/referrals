import React, { useState } from 'react';
import { loginAffiliate } from '../../api/affiliate';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';

const AffiliateLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password, 'affiliate');
      navigate('/affiliate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />

      <div className="flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md space-y-6 p-8 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div>
            <h2 className="text-3xl font-bold text-center">Affiliate Login</h2>
            <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              Access your dashboard and referral tools
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="affiliate@example.com"
                className={`w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className={`w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none 
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link to="/affiliate/signup" className="text-green-600 hover:underline">
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLogin;
