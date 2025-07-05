import { useState } from 'react';
import PropTypes from 'prop-types';

const ColorPicker = ({ 
  selectedColor = '#000000', 
  onColorChange, 
  label = 'Choose Color',
  predefinedColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor);

  const handleColorSelect = (color) => {
    onColorChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Color Display Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
      >
        <div 
          className="w-8 h-8 rounded border-2 border-gray-300"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-gray-700 font-mono text-sm">
          {selectedColor.toUpperCase()}
        </span>
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          
          {/* Predefined Colors */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Predefined Colors
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-12 h-12 rounded border-2 hover:scale-110 transition-transform duration-150 ${
                    selectedColor === color 
                      ? 'border-indigo-500 ring-2 ring-indigo-200' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </h4>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onColorChange(e.target.value);
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  selectedColor: PropTypes.string,
  onColorChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  predefinedColors: PropTypes.arrayOf(PropTypes.string),
};

export default ColorPicker;