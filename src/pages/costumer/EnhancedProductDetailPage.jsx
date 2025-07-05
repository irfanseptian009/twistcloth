import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Rating } from '@mui/material';
import { FaHeart, FaShareAlt, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { FiPackage, FiTruck, FiShield } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { fetchItems } from '../../store/features/items/ProductSlice';
import Enhanced3DModelViewer from '../../components/Enhanced3DModelViewer';
import { toast } from 'react-toastify';

function EnhancedProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading: loadingItems, error } = useSelector((s) => s.items);  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    if (!items.length) dispatch(fetchItems());
  }, [dispatch, items.length]);

  const product = items.find((item) => item.id === id);

  // Set default color and size when product loads
  useEffect(() => {
    if (product) {
      if (product.availableColors && product.availableColors.length > 0) {
        setSelectedColor(product.availableColors[0]);
      }
      if (product.availableSizes && product.availableSizes.length > 0) {
        setSelectedSize(product.availableSizes[0]);
      }
    }
  }, [product]);

  if (loadingItems) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h5" className="mb-4">Product not found</Typography>
          <button
            onClick={() => navigate('/costumer')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </Box>
    );
  }

  // Get all product images
  const allImages = [
    product.image,
    ...(product.additionalImages || [])
  ].filter(Boolean);

  const handleAddToCart = () => {
    toast.success(`Added ${product.name} to cart!`);
    // Add your cart logic here
  };

  const handleBuyNow = () => {
    toast.info('Redirecting to checkout...');
    // Add your checkout logic here
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/costumer')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          
          {/* Left Column - Images and 3D */}
          <div className="space-y-6">
            
            {/* Main Image */}
            {allImages.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Thumbnails */}
                {allImages.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index
                            ? 'border-indigo-500'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3D Model Viewer */}
            {(product.model3D || (product.model3DVariants && product.model3DVariants.length > 0)) && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HiSparkles className="w-5 h-5 mr-2 text-indigo-500" />
                  3D Preview
                </h3>
                <Enhanced3DModelViewer
                  product={product}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="mt-8 lg:mt-0 space-y-6">
            
            {/* Product Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4">
                    <Rating value={4.5} precision={0.5} readOnly size="small" />
                    <span className="text-sm text-gray-500">(4.5) • 124 reviews</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FaHeart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FaShareAlt className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-4">
                {formatPrice(product.price)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                <FiPackage className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Color Selection */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Color: <span className="text-gray-900">{selectedColor}</span>
                  </h4>
                  <div className="flex space-x-2">
                    {product.availableColors.map((color, index) => (
                      <button
                        key={`${color}-${index}`}
                        onClick={() => setSelectedColor(color)}
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

              {/* Size Selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Size: <span className="text-gray-900">{selectedSize}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
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

              {/* Quantity */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quantity</h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <FaShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <FiTruck className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiShield className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
                    <p className="text-xs text-gray-500">Quality guarantee</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPackage className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <span className="text-gray-400">{showDescription ? '−' : '+'}</span>
              </button>
              {showDescription && (
                <div className="mt-4 text-gray-700 leading-relaxed">
                  {product.description}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedProductDetailPage;
