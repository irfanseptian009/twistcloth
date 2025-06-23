import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../../store/features/items/ProductSlice';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { FiX, FiUpload, FiSave, FiLoader } from 'react-icons/fi';

const AddProduct = ({ onClose, currentItem }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    image: null, 
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
  });

  useEffect(() => {
    if (currentItem) {
      setForm({
        image: currentItem.image || null,
        name: currentItem.name || '',
        price: currentItem.price || '',
        stock: currentItem.stock || '',
        categoryId: currentItem.categoryId || '',
        description: currentItem.description || '',
      });
      if (currentItem.image) {
        setImagePreview(currentItem.image);
      }
    } else {
      setForm({
        image: null,
        name: '',
        price: '',
        stock: '',
        categoryId: '',
        description: '',
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
        
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };
  const handleFileInputClick = (e) => {
    e.stopPropagation();
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
    } catch {
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
  ];  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Product Name */}
            <div>
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
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Description */}
            <div>
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
            </div>            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image {!currentItem && '*'}
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
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
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors duration-150 cursor-pointer">
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  onClick={handleFileInputClick}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!currentItem && !imagePreview}
                />
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

AddProduct.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryId: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default AddProduct;
