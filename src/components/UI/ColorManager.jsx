import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import ColorPicker from './ColorPicker';
import PropTypes from 'prop-types';

const ColorManager = ({ colors = [], onColorsChange, label = 'Available Colors' }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  // Add new color
  const addColor = () => {
    if (!colors.includes(selectedColor)) {
      const newColors = [...colors, selectedColor];
      onColorsChange(newColors);
      setShowColorPicker(false);
      setSelectedColor('#000000');
    } else {
      alert('This color is already added');
    }
  };

  // Remove color
  const removeColor = (colorToRemove) => {
    const newColors = colors.filter(color => color !== colorToRemove);
    onColorsChange(newColors);
  };

  // Get color name for display
  const getColorName = (color) => {
    const colorNames = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#A52A2A': 'Brown',
      '#808080': 'Gray',
      '#000080': 'Navy',
      '#008000': 'Dark Green'
    };
    return colorNames[color.toUpperCase()] || color.toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowColorPicker(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-150"
        >
          <FiPlus className="w-3 h-3 mr-1" />
          Add Color
        </button>
      </div>

      {/* Color List */}
      {colors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div
                className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700 flex-1 truncate">
                {getColorName(color)}
              </span>
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm">No colors added yet</p>
          <p className="text-gray-400 text-xs mt-1">Click &quot;Add Color&quot; to get started</p>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Color</h3>
              <button
                type="button"
                onClick={() => setShowColorPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <ColorPicker
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              label="Select Color"
            />
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowColorPicker(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 transition-colors duration-150"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ColorManager.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  onColorsChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default ColorManager;
