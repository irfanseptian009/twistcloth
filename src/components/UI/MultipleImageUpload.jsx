import { useState, useCallback } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import PropTypes from 'prop-types';

const MultipleImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFiles = useCallback((files) => {
    const newFiles = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    
    // Validate file types
    const validFiles = filesToAdd.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        console.warn(`${file.name} is not a valid image file`);
      }
      return isImage;
    });

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      onImagesChange(newImages);
    }
  }, [images, maxImages, onImagesChange]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove image
  const removeImage = useCallback((index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // Get image preview URL
  const getImageUrl = (image) => {
    if (typeof image === 'string') {
      return image; // URL from server
    }
    return URL.createObjectURL(image); // File object
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 cursor-pointer ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Click to upload or drag and drop images
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, WEBP up to 10MB each ({images.length}/{maxImages} images)
          </p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={getImageUrl(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-150 opacity-0 group-hover:opacity-100"
              >
                <FiX className="w-4 h-4" />
              </button>
              
              {/* Image index */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info text */}
      {images.length === 0 && (
        <div className="text-center py-8">
          <FiImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

MultipleImageUpload.propTypes = {
  images: PropTypes.array,
  onImagesChange: PropTypes.func.isRequired,
  maxImages: PropTypes.number,
};

export default MultipleImageUpload;
