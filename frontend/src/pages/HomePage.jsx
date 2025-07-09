import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-500`}>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">
          referals.leda
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-6 px-8 py-16 items-center">
        {/* Left - Branding */}
        <div className="text-left space-y-6">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-green-600">referrals.leada</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Empower your affiliate program with fast, secure and flexible referral management.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-3 bg-gradient-to-br from-green-400 to-green-700 hover:from-green-500 hover:to-green-800 text-white font-medium rounded-xl shadow-md transition duration-300"
          >
            Admin Login
          </button>
        </div>

        {/* Right - Login Placeholder */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
          />
          <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300">
            Login
          </button>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="px-8 py-16 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 transition-colors duration-500">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose referrals.leada?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Easy Integration', desc: 'Connect your e-commerce store within minutes and start tracking referrals instantly.' },
            { title: 'Real-time Stats', desc: 'View referrals, conversions, and payouts in a live dashboard.' },
            { title: 'Secure & Scalable', desc: 'Built with security and growth in mind. Handle thousands of referrals with ease.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
