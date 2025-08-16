import { FiTrash2, FiAlertTriangle, FiX, FiLoader } from 'react-icons/fi';
import PropTypes from 'prop-types';

const DeleteProductModal = ({ isOpen, onClose, onConfirm, product, isDeleting }) => {
  if (!isOpen) return null;

  const getFileCount = () => {
    let count = 0;
    
    // Main image
    if (product?.image) count++;
    
    // Additional images
    if (product?.additionalImages?.length > 0) {
      count += product.additionalImages.length;
    }
    
    // Single 3D model (backward compatibility)
    if (product?.model3D) count++;
    
    // 3D model variants
    if (product?.model3DVariants?.length > 0) {
      count += product.model3DVariants.length;
    }
    
    return count;
  };

  const fileCount = getFileCount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiTrash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <FiAlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-700 mb-2">
                Are you sure you want to delete <strong>&quot;{product?.name}&quot;</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* File deletion info */}
          {fileCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Files to be deleted from Cloudinary:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {product?.image && (
                  <li>• Main product image</li>
                )}
                {product?.additionalImages?.length > 0 && (
                  <li>• {product.additionalImages.length} additional image{product.additionalImages.length > 1 ? 's' : ''}</li>
                )}
                {product?.model3D && (
                  <li>• Main 3D model</li>
                )}
                {product?.model3DVariants?.length > 0 && (
                  <li>• {product.model3DVariants.length} 3D model variant{product.model3DVariants.length > 1 ? 's' : ''}</li>
                )}
              </ul>
              <p className="text-xs text-red-600 mt-2">
                Total: {fileCount} file{fileCount > 1 ? 's' : ''} will be permanently deleted from Cloudinary
              </p>
            </div>
          )}

          {/* Product info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              {product?.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{product?.name}</p>
                <p className="text-sm text-gray-500">
                  Price: Rp {product?.price?.toLocaleString()} • Stock: {product?.stock}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    image: PropTypes.string,
    additionalImages: PropTypes.array,
    model3D: PropTypes.string,
    model3DVariants: PropTypes.array,
  }),
  isDeleting: PropTypes.bool,
};

DeleteProductModal.defaultProps = {
  isDeleting: false,
};

export default DeleteProductModal;
