import { useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductDebugInfo = ({ product, selectedVariant, onClose }) => {
  // Auto-hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!product) return null;

  const currentVariant = product?.model3DVariants?.[selectedVariant];

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg z-50 max-w-md text-xs">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-yellow-400">🐛 Product Debug Info</h4>
        <button onClick={onClose} className="text-red-400 hover:text-red-300">
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-blue-400">Product ID:</span> {product?.id || 'N/A'}
        </div>
        <div>
          <span className="text-blue-400">Product Name:</span> {product?.name || 'N/A'}
        </div>
        <div>
          <span className="text-blue-400">Main Image:</span> {product?.image ? '✅' : '❌'}
        </div>
        <div>
          <span className="text-blue-400">Additional Images:</span> {product?.additionalImages?.length || 0}
        </div>
        <div>
          <span className="text-blue-400">Single 3D Model:</span> {product?.model3D ? '✅' : '❌'}
        </div>
        <div>
          <span className="text-blue-400">3D Variants:</span> {product?.model3DVariants?.length || 0}
        </div>
        
        {currentVariant && (
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-green-400 font-bold">Current Variant:</div>
            <div>
              <span className="text-blue-400">Name:</span> {currentVariant.name || 'N/A'}
            </div>
            <div>
              <span className="text-blue-400">Color Name:</span> {currentVariant.colorName || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">Color Hex:</span> 
              <div 
                className="w-4 h-4 border border-white rounded"
                style={{ backgroundColor: currentVariant.colorHex || '#000' }}
              />
              {currentVariant.colorHex || 'N/A'}
            </div>
            <div>
              <span className="text-blue-400">Model URL:</span> {currentVariant.modelUrl ? '✅' : '❌'}
            </div>
            <div>
              <span className="text-blue-400">Sizes:</span> {currentVariant.sizes?.join(', ') || 'None'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProductDebugInfo.propTypes = {
  product: PropTypes.object,
  selectedVariant: PropTypes.number,
  onClose: PropTypes.func,
};

export default ProductDebugInfo;
