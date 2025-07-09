import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition">
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
    </button>
  );
}
