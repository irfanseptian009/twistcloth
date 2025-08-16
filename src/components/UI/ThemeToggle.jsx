import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';

const ThemeToggle = ({ variant = 'floating', size = 'md' }) => {
  const { isDarkMode, toggleTheme, colors, button } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const variantClasses = {
    floating: `fixed top-6 right-6 z-50 ${colors.surface} ${colors.border} shadow-lg hover:shadow-xl`,
    inline: `${button.secondary}`,
    minimal: `${button.ghost}`,
    gradient: `bg-gradient-to-r ${colors.primary} text-white`
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        ${isAnimating ? 'animate-pulse' : ''}
        group
      `}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <div className="relative overflow-hidden">
        {/* Sun Icon */}
        <FaSun 
          className={`
            absolute transition-all duration-500 ease-in-out transform
            ${isDarkMode ? '-translate-y-6 opacity-0 rotate-180' : 'translate-y-0 opacity-100 rotate-0'}
            text-yellow-500 group-hover:scale-110
          `}
        />
        
        {/* Moon Icon */}
        <FaMoon 
          className={`
            absolute transition-all duration-500 ease-in-out transform
            ${isDarkMode ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-6 opacity-0 -rotate-180'}
            text-blue-400 group-hover:scale-110
          `}
        />
      </div>

      {/* Animated background effect */}
      <div className={`
        absolute inset-0 rounded-full
        bg-gradient-to-r from-yellow-400/20 to-blue-400/20
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        ${isAnimating ? 'animate-ping' : ''}
      `} />
    </button>
  );
};

// PropTypes validation
ThemeToggle.propTypes = {
  variant: PropTypes.oneOf(['floating', 'inline', 'minimal', 'gradient']),
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

const ThemeSelector = () => {
  const { isDarkMode, setLightMode, setDarkMode, colors, glass } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-selector')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: FaSun,
      gradient: 'from-yellow-400 to-orange-400',
      active: !isDarkMode,
      action: setLightMode
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: FaMoon,
      gradient: 'from-blue-600 to-purple-600',
      active: isDarkMode,
      action: setDarkMode
    }
  ];

  return (
    <div className="theme-selector relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          ${glass.background} ${glass.border}
          transition-all duration-300 hover:scale-105
          ${colors.text}
        `}
        title="Theme Options"
      >
        <FaPalette className="text-lg" />
      </button>

      {isOpen && (
        <div className={`
          absolute top-12 right-0 w-48 p-3 rounded-xl
          ${glass.background} ${glass.border} ${glass.shadow}
          z-50 animate-in slide-in-from-top-2 duration-200
        `}>
          <h3 className={`text-sm font-semibold mb-3 ${colors.text}`}>
            Choose Theme
          </h3>
          
          <div className="space-y-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  theme.action();
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg
                  transition-all duration-200
                  ${theme.active 
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg` 
                    : `${colors.surfaceSecondary} ${colors.text} hover:${colors.surface}`
                  }
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${theme.active ? 'bg-white/20' : `bg-gradient-to-r ${theme.gradient}`}
                `}>
                  <theme.icon className={`text-sm ${theme.active ? 'text-white' : 'text-white'}`} />
                </div>
                <span className="font-medium">{theme.name}</span>
                {theme.active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className={`mt-3 pt-3 border-t ${colors.borderLight}`}>
            <p className={`text-xs ${colors.textMuted} text-center`}>
              Theme syncs across devices
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { ThemeToggle, ThemeSelector };
export default ThemeToggle;
