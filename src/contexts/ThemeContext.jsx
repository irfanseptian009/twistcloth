import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const setLightMode = () => {
    setIsDarkMode(false);
    localStorage.setItem('theme', 'light');
  };

  const setDarkMode = () => {
    setIsDarkMode(true);
    localStorage.setItem('theme', 'dark');
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = {
    isDarkMode,
    toggleTheme,
    setLightMode,
    setDarkMode,
    // Theme colors
    colors: {
      primary: isDarkMode 
        ? 'from-purple-600 to-pink-600' 
        : 'from-purple-500 to-pink-500',
      secondary: isDarkMode 
        ? 'from-blue-600 to-purple-600' 
        : 'from-blue-500 to-purple-500',
      background: isDarkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
      surface: isDarkMode 
        ? 'bg-gray-800' 
        : 'bg-white',
      surfaceSecondary: isDarkMode 
        ? 'bg-gray-700' 
        : 'bg-gray-50',
      text: isDarkMode 
        ? 'text-white' 
        : 'text-gray-800',
      textSecondary: isDarkMode 
        ? 'text-gray-300' 
        : 'text-gray-600',
      textMuted: isDarkMode 
        ? 'text-gray-400' 
        : 'text-gray-500',
      border: isDarkMode 
        ? 'border-gray-600' 
        : 'border-gray-200',
      borderLight: isDarkMode 
        ? 'border-gray-700' 
        : 'border-gray-100',
      accent: isDarkMode 
        ? 'from-emerald-600 to-teal-600' 
        : 'from-emerald-500 to-teal-500',
      danger: isDarkMode 
        ? 'from-red-600 to-pink-600' 
        : 'from-red-500 to-pink-500',
      warning: isDarkMode 
        ? 'from-orange-600 to-yellow-600' 
        : 'from-orange-500 to-yellow-500',
      success: isDarkMode 
        ? 'from-green-600 to-emerald-600' 
        : 'from-green-500 to-emerald-500',
    },
    // Glass effects
    glass: {
      background: isDarkMode 
        ? 'bg-gray-800/80 backdrop-blur-xl' 
        : 'bg-white/80 backdrop-blur-xl',
      border: isDarkMode 
        ? 'border border-gray-700/50' 
        : 'border border-white/20',
      shadow: isDarkMode 
        ? 'shadow-2xl shadow-black/20' 
        : 'shadow-2xl shadow-purple-500/10',
    },
    // Button styles
    button: {
      primary: isDarkMode 
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
      secondary: isDarkMode 
        ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
        : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200',
      ghost: isDarkMode 
        ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
