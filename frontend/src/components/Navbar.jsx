import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { darkMode } = useTheme();

  return (
    <header className={`w-full px-6 py-4 shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition`}>
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">
          referrals.leada
        </Link>

        {/* Right - Theme Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
