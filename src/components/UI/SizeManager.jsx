import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import PropTypes from 'prop-types';

const SizeManager = ({ sizes = [], onSizesChange }) => {
  const [customSize, setCustomSize] = useState('');
  
  const predefinedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  
  const toggleSize = (size) => {
    const updatedSizes = sizes.includes(size)
      ? sizes.filter(s => s !== size)
      : [...sizes, size];
    onSizesChange(updatedSizes);
  };
  
  const addCustomSize = () => {
    if (customSize.trim() && !sizes.includes(customSize.trim())) {
      onSizesChange([...sizes, customSize.trim()]);
      setCustomSize('');
    }
  };
  
  const removeSize = (sizeToRemove) => {
    onSizesChange(sizes.filter(size => size !== sizeToRemove));
  };
  
  const customSizes = sizes.filter(size => !predefinedSizes.includes(size));

  return (
    <div className="space-y-4">
      {/* Predefined Sizes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Standard Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {predefinedSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                sizes.includes(size)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Size Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Custom Size
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            placeholder="e.g., 28, 30, Free Size"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={addCustomSize}
            disabled={!customSize.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Sizes Display */}
      {customSizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {customSizes.map((size, index) => (
              <div
                key={`custom-${index}`}
                className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
              >
                <span className="text-sm text-gray-700 mr-2">{size}</span>
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Sizes Summary */}
      {sizes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected sizes ({sizes.length}):</strong> {sizes.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

SizeManager.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string),
  onSizesChange: PropTypes.func.isRequired,
};

export default SizeManager;
