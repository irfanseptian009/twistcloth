import React, { useState, useEffect } from 'react';
import { BiBot } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { FaEye, FaRainbow, FaTshirt, FaGem, FaCalendarAlt, FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const AIAnalysisProgress = ({ isAnalyzing, progress }) => {
  const { colors, glass } = useTheme();
  const [currentStage, setCurrentStage] = useState(0);

  const analysisStages = [
    { icon: FaEye, label: 'Menganalisis gambar...', color: 'text-blue-500' },
    { icon: FaRainbow, label: 'Mendeteksi warna...', color: 'text-green-500' },
    { icon: FaTshirt, label: 'Menganalisis fit...', color: 'text-purple-500' },
    { icon: FaGem, label: 'Evaluasi styling...', color: 'text-pink-500' },
    { icon: FaCalendarAlt, label: 'Saran occasion...', color: 'text-orange-500' },
    { icon: FaStar, label: 'Memberikan rating...', color: 'text-yellow-500' }
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev < analysisStages.length - 1) {
          return prev + 1;
        }
        return 0; // Reset to create cycling effect
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnalyzing, analysisStages.length]);

  if (!isAnalyzing) return null;

  return (
    <div className={`${glass.background} ${glass.border} rounded-xl p-6 text-center`}>
      {/* Main Bot Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <BiBot className="text-6xl text-purple-500 animate-pulse" />
          <div className="absolute -top-2 -right-2">
            <HiSparkles className="text-xl text-yellow-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress || (currentStage + 1) * (100 / analysisStages.length)}%` }}
        ></div>
      </div>

      {/* Current Stage */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3">
          {React.createElement(analysisStages[currentStage].icon, {
            className: `text-2xl ${analysisStages[currentStage].color} animate-bounce`
          })}
          <span className={`font-medium ${colors.text}`}>
            {analysisStages[currentStage].label}
          </span>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-center space-x-2">
          {analysisStages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStage 
                  ? 'bg-purple-500 scale-110' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
        <p className={`text-sm ${colors.textMuted} italic`}>
          💡 AI sedang menganalisis lebih dari 50 aspek fashion untuk memberikan saran terbaik!
        </p>
      </div>
    </div>
  );
};

AIAnalysisProgress.propTypes = {
  isAnalyzing: PropTypes.bool.isRequired,
  progress: PropTypes.number
};

export default AIAnalysisProgress;