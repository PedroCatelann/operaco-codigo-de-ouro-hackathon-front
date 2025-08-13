import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { IoMoon, IoSunny } from 'react-icons/io5';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
      }}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <IoMoon size={20} />
      ) : (
        <IoSunny size={20} />
      )}
    </button>
  );
};

export default ThemeToggle; 