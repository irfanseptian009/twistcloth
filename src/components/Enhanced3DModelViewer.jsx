import { useState, useRef, useEffect, useMemo } from 'react';
import { FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { HiColorSwatch } from 'react-icons/hi';
import { BsBoxSeam } from 'react-icons/bs';
import Simple3DViewer from '../Simple3DViewer';
import PropTypes from 'prop-types';

const Enhanced3DModelViewer = ({ 
  product, 
  selectedColor, 
  onColorChange, 
  selectedSize, 
  onSizeChange,
  className = ''
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const containerRef = useRef(null);
  // Combine 3D models from single model and variants
  const available3DModels = useMemo(() => {
    const models = [];
    
    // Add single 3D model (backward compatibility)
    if (product.model3D) {
      models.push({
        id: 'single-model',
        name: 'Main Model',
        colorName: 'Default',
        colorHex: product.availableColors?.[0] || '#000000',
        modelUrl: product.model3D,
        sizes: product.availableSizes || [],
        description: 'Main 3D model'
      });
    }
    
    // Add variant models
    if (product.model3DVariants && product.model3DVariants.length > 0) {
      models.push(...product.model3DVariants);
    }
    
    return models;
  }, [product.model3D, product.model3DVariants, product.availableColors, product.availableSizes]);

  // Get current selected model
  const currentModel = available3DModels[selectedVariantIndex];
  
  // Get available colors from all models and product colors
  const availableColors = [
    ...(product.availableColors || []),
    ...available3DModels.map(model => model.colorHex)
  ].filter((color, index, self) => self.indexOf(color) === index);

  // Get available sizes from all models and product sizes
  const availableSizes = [
    ...(product.availableSizes || []),
    ...available3DModels.flatMap(model => model.sizes || [])
  ].filter((size, index, self) => self.indexOf(size) === index);

  // Effect to update selected variant when color changes
  useEffect(() => {
    const matchingVariantIndex = available3DModels.findIndex(
      model => model.colorHex === selectedColor
    );
    if (matchingVariantIndex !== -1 && matchingVariantIndex !== selectedVariantIndex) {
      setSelectedVariantIndex(matchingVariantIndex);
    }
  }, [selectedColor, available3DModels, selectedVariantIndex]);

  const handleColorChange = (color) => {
    onColorChange(color);
    // Find matching variant for the selected color
    const matchingVariantIndex = available3DModels.findIndex(
      model => model.colorHex === color
    );
    if (matchingVariantIndex !== -1) {
      setSelectedVariantIndex(matchingVariantIndex);
    }
  };

  const handleVariantChange = (variantIndex) => {
    setSelectedVariantIndex(variantIndex);
    const variant = available3DModels[variantIndex];
    if (variant && variant.colorHex) {
      onColorChange(variant.colorHex);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  if (available3DModels.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <BsBoxSeam className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No 3D models available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 3D Viewer */}
      <div 
        ref={containerRef}
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${
          isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-square'
        }`}
      >
        <Simple3DViewer
          modelUrl={currentModel?.modelUrl}
          color={selectedColor}
          autoRotate={isRotating}
          zoomInTrigger={zoomInTrigger}
          zoomOutTrigger={zoomOutTrigger}
          resetTrigger={resetTrigger}
          className="w-full h-full"
        />
        
        {/* 3D Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isRotating 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
            title="Toggle Auto Rotate"
          >
            <FiRotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomInTrigger(prev => prev + 1)}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
            title="Zoom In"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomOutTrigger(prev => prev + 1)}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
            title="Zoom Out"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setResetTrigger(prev => prev + 1)}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
            title="Reset View"
          >
            <BsBoxSeam className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Model Info Overlay */}
        {currentModel && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-medium">{currentModel.name}</p>
            <p className="text-xs opacity-75">{currentModel.colorName}</p>
          </div>
        )}
      </div>

      {/* 3D Model Variants Selector */}
      {available3DModels.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <BsBoxSeam className="w-4 h-4 mr-2" />
            3D Model Variants
          </h4>
          <div className="flex flex-wrap gap-2">
            {available3DModels.map((model, index) => (
              <button
                key={model.id || index}
                onClick={() => handleVariantChange(index)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  selectedVariantIndex === index
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: model.colorHex }}
                />
                <span>{model.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {availableColors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <HiColorSwatch className="w-4 h-4 mr-2" />
            Available Colors
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-indigo-500 scale-110 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Available Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, index) => (
              <button
                key={`${size}-${index}`}
                onClick={() => onSizeChange(size)}
                className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Enhanced3DModelViewer.propTypes = {
  product: PropTypes.shape({
    model3D: PropTypes.string,
    model3DVariants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      colorName: PropTypes.string,
      colorHex: PropTypes.string,
      description: PropTypes.string,
      sizes: PropTypes.arrayOf(PropTypes.string),
      modelUrl: PropTypes.string,
      isRequired: PropTypes.bool,
    })),
    availableColors: PropTypes.arrayOf(PropTypes.string),
    availableSizes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  selectedColor: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired,
  selectedSize: PropTypes.string.isRequired,
  onSizeChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Enhanced3DModelViewer;
