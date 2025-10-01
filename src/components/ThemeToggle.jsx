import React, { useState, useEffect } from 'react';

const ThemeToggle = ({ theme, setTheme }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      setIsAnimating(false);
    }, 150);
  };

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      } ${isAnimating ? 'scale-110' : 'scale-100'}`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${
          theme === 'dark' ? 'left-0.5' : 'left-6'
        } ${isAnimating ? 'rotate-180' : 'rotate-0'}`}
      >
        <div className="w-full h-full flex items-center justify-center text-xs">
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
