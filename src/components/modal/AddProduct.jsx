import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../../store/features/items/ProductSlice';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { FiSave, FiLoader } from 'react-icons/fi';
import MultipleImageUpload from '../UI/MultipleImageUpload';
import GLBFileUpload from '../UI/GLBFileUpload';
import Multiple3DModelManager from '../UI/Multiple3DModelManager';

const AddProductNew = ({ onClose, currentItem }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);  const [form, setForm] = useState({
    image: null, 
    additionalImages: [],
    model3D: null,
    model3DVariants: [],
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
    availableColors: ['#000000'],
    availableSizes: ['M'],
    iframeUrl: '',
  });
  useEffect(() => {
    if (currentItem) {
      setForm({
        image: currentItem.image || null,
        additionalImages: currentItem.additionalImages || [],
        model3D: currentItem.model3D || null,
        model3DVariants: currentItem.model3DVariants || [],
        name: currentItem.name || '',
        price: currentItem.price || '',
        stock: currentItem.stock || '',
        categoryId: currentItem.categoryId || '',
        description: currentItem.description || '',
        availableColors: currentItem.availableColors || ['#000000'],
        availableSizes: currentItem.availableSizes || ['M'],
        iframeUrl: currentItem.iframeUrl || '',
      });
      if (currentItem.image) {
        setImagePreview(currentItem.image);
      }
    } else {
      setForm({
        image: null,
        additionalImages: [],
        model3D: null,
        model3DVariants: [],
        name: '',
        price: '',
        stock: '',
        categoryId: '',
        description: '',
        availableColors: ['#000000'],
        availableSizes: ['M'],
        iframeUrl: '',
      });
      setImagePreview(null);
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm((prevForm) => ({ ...prevForm, [name]: file }));
        
        // Create image preview for main image
        if (name === 'image') {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (currentItem) {
        await dispatch(updateItem({ id: currentItem.id, ...form })).unwrap();
        toast.success(`Product "${form.name}" updated successfully!`);
      } else {
        await dispatch(addItem(form)).unwrap();
        toast.success(`Product "${form.name}" added successfully!`);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(currentItem ? "Failed to update product" : "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'men', label: 'Men\'s Fashion' },
    { id: 'women', label: 'Women\'s Fashion' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'bags', label: 'Bags' },
  ];

  return (
    <div className="p-6 max-h-screen overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Product Name */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                required
              />
            </div>

            {/* Price and Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (IDR) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                required
                min="0"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Enter product description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150 resize-none"
                required
              />
            </div>
            {/* Iframe Link */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3D Iframe Link (Sketchfab, dsb)
              </label>
              <input
                type="text"
                name="iframeUrl"
                placeholder="https://sketchfab.com/models/xxxx/embed?..."
                value={form.iframeUrl || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-150"
              />
              <p className="text-xs text-gray-500 mt-1">Opsional. Paste link embed iframe 3D viewer di sini.</p>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Main Product Image</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image {!currentItem && '*'}
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden max-w-md">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setForm(prev => ({ ...prev, image: null }));
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-150"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-150 cursor-pointer max-w-md">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Click to upload main image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required={!currentItem && !imagePreview}
              />
            </div>
          </div>
        </div>

        {/* Additional Images */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Images</h3>
          <MultipleImageUpload
            images={form.additionalImages}
            onImagesChange={(images) => setForm(prev => ({ ...prev, additionalImages: images }))}
            maxImages={8}
          />
        </div>        {/* 3D Models */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">3D Models & Variants</h3>
          <div className="space-y-4">
            {/* Single 3D Model (Backward Compatibility) */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Original 3D Model</h4>
              <GLBFileUpload
                file={form.model3D}
                onFileChange={(file) => setForm(prev => ({ ...prev, model3D: file }))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload the original 3D model file (will be used as default if no variants are added)
              </p>
            </div>
            
            {/* Multiple 3D Models */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Color Variants</h4>
              <Multiple3DModelManager
                models={form.model3DVariants}
                onChange={(variants) => setForm(prev => ({ ...prev, model3DVariants: variants }))}
              />
              <p className="text-sm text-gray-500 mt-1">
                Add different color variants of the same product with their own 3D models, sizes, and descriptions
              </p>
            </div>
          </div>
        </div>

        {/* Note about Colors and Sizes */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Color & Size Management
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Colors and sizes are now managed through the 3D Model Variants above. 
                  Each variant can have its own color and available sizes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                {currentItem ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                {currentItem ? 'Update Product' : 'Add Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

AddProductNew.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    additionalImages: PropTypes.arrayOf(PropTypes.string),
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
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryId: PropTypes.string,
    description: PropTypes.string,
    availableColors: PropTypes.arrayOf(PropTypes.string),
    availableSizes: PropTypes.arrayOf(PropTypes.string),
    iframeUrl: PropTypes.string,
  }),
};

export default AddProductNew;
