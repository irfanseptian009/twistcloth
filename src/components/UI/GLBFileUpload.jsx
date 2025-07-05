import { useState, useCallback } from 'react';
import { FiUpload, FiX, FiBox, FiDownload } from 'react-icons/fi';
import PropTypes from 'prop-types';

const GLBFileUpload = ({ file, onFileChange, required = false }) => {
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const fileName = selectedFile.name.toLowerCase();
    const isValidFile = fileName.endsWith('.glb') || fileName.endsWith('.gltf');
    
    if (!isValidFile) {
      alert('Please upload a valid 3D file (.glb or .gltf)');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      alert('File size must be less than 50MB');
      return;
    }

    onFileChange(selectedFile);
  }, [onFileChange]);

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
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFile]);

  // Remove file
  const removeFile = useCallback(() => {
    onFileChange(null);
  }, [onFileChange]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file display name
  const getFileName = () => {
    if (typeof file === 'string') {
      // Extract filename from URL
      const urlParts = file.split('/');
      return urlParts[urlParts.length - 1].split('?')[0];
    }
    return file?.name || '';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area or File Display */}
      {!file ? (
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
            accept=".glb,.gltf"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required={required}
          />
          <FiBox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Click to upload or drag and drop 3D model
          </p>
          <p className="text-sm text-gray-500">
            GLB or GLTF files up to 50MB
          </p>
        </div>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FiBox className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getFileName()}
                </p>
                {file instanceof File && (
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Download button for URL files */}
              {typeof file === 'string' && (
                <a
                  href={file}
                  download
                  className="p-2 text-gray-500 hover:text-indigo-500 transition-colors duration-150"
                  title="Download file"
                >
                  <FiDownload className="w-4 h-4" />
                </a>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                onClick={removeFile}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-150"
                title="Remove file"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload new file button when file exists */}
      {file && (
        <div className="text-center">
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-150">
            <FiUpload className="w-4 h-4 mr-2" />
            Upload New File
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleInputChange}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

GLBFileUpload.propTypes = {
  file: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onFileChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default GLBFileUpload;
