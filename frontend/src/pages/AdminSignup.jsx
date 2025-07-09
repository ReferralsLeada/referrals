import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupAdmin } from '../api/admin';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await signupAdmin(formData);
      console.log('✅ Signup API response:', response);
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md p-8 rounded-lg shadow-md transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-3xl font-bold text-center mb-6">Admin Signup</h2>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {['name', 'email', 'password', 'passwordConfirm'].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-medium mb-1 capitalize">
                  {field === 'passwordConfirm' ? 'Confirm Password' : field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field.includes('password') ? 'password' : field}
                  required
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border shadow-sm focus:outline-none transition-all
                    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a href="/admin/login" className="text-green-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
