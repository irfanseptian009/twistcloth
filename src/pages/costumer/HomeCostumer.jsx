import { FaSortAmountUp, FaCalendarAlt, FaTags, FaShoePrints } from "react-icons/fa";
import { FiGrid,  } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchItems } from "../../store/features/items/ProductSlice";
import { Banner, Footer, ProductCard, ReviewCard } from "../../components/costumer";
import Collections from "./Collections";
import Shop from "./Shop";
import { useTheme } from "../../contexts/ThemeContext";
import { RiMenLine, RiWomenLine } from "react-icons/ri";
import { MdBackpack} from "react-icons/md";

const HomeCostumer = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // Mengambil data produk, status, dan error dari Redux store
  const items = useSelector(state => state.items.items);
  const status = useSelector(state => state.items.status);
  const error = useSelector(state => state.items.error);

  // State untuk opsi sorting dan filtering
  const [sortPrice, setSortPrice] = useState('');
  const [sortDate, setSortDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Kategori yang tersedia (sama dengan yang ada di admin dashboard)
  const categories = [
    { id: 'all', label: 'All Products', icon: FiGrid },
    { id: 'men', label: 'Men\'s Fashion', icon: RiMenLine },
    { id: 'women', label: 'Women\'s Fashion', icon: RiWomenLine },
    { id: 'accessories', label: 'Accessories', icon: FaTags },
    { id: 'shoes', label: 'Shoes', icon: FaShoePrints },
    { id: 'bags', label: 'Bags', icon: MdBackpack  },
  ];

  // Mengambil produk saat komponen dipasang
  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  // Handler untuk perubahan opsi sorting harga
  const handleSortPriceChange = (e) => {
    setSortPrice(e.target.value);
  };

  // Handler untuk perubahan opsi sorting tanggal
  const handleSortDateChange = (e) => {
    setSortDate(e.target.value);
  };

  // Handler untuk perubahan kategori
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Menghitung daftar produk yang telah difilter dan diurutkan berdasarkan opsi yang dipilih
  const sortedItems = useMemo(() => {
    let filtered = [...items];

    // Filter berdasarkan kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }

    // Sorting berdasarkan harga
    if (sortPrice === 'highest') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortPrice === 'lowest') {
      filtered.sort((a, b) => a.price - b.price);
    }

    // Sorting berdasarkan tanggal
    if (sortDate === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortDate === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [items, sortPrice, sortDate, selectedCategory]);

  return (
    <>      <div className={`${colors.surfaceSecondary}`}>
        <Banner/>
      </div>
      <div className="container mx-auto mt-8 xl:p-18 lg:p-14 md:p-10 sm:p-6 p-4">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className={`text-3xl text-center font-bold tracking-tight ${colors.text} mb-2`}>Our Products</h2>
          <p className={`${colors.textMuted} text-xm text-center`}>Discover amazing fashion pieces for every style</p>
        </div>

        {/* Category Filter Section */}
        <div className={`${colors.surface} rounded-2xl shadow-lg border ${colors.border} p-6 mb-8 backdrop-blur-sm`}>
       
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`group p-2 rounded-xl shadow-lg border-2 border-gray-100  transition-all duration-300 hover:scale-105 transform relative overflow-hidden backdrop-blur-sm ${
                  selectedCategory === category.id
                    ? 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-lg  animate-pulse'
                    : `border-gray-200 ${colors.surface} ${colors.text} hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50 hover:-translate-y-1`
                }`}
                style={{
                  boxShadow: selectedCategory === category.id 
                    ? '0 10px 25px rgba(147, 51, 234, 0.3)' 
                    : undefined
                }}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-gray-400 to-pink-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  selectedCategory === category.id ? 'opacity-5' : ''
                }`}></div>
                
                <div className="relative flex flex-col items-center space-y-2">
                  <category.icon 
                    className={`w-6 h-6 transition-all duration-300 group-hover:scale-110 ${
                      selectedCategory === category.id 
                        ? 'text-gray-500' 
                        : `${colors.textMuted} group-hover:text-gray-400`
                    }`} 
                  />
                  <span className="text-sm font-medium text-center leading-tight">
                    {category.label}
                  </span>
                  
                  {/* Selected indicator */}
                  {selectedCategory === category.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div className={`${colors.text}`}>
            {selectedCategory === 'all' ? (
              <p className="text-lg">
                Showing <span className="font-semibold">{sortedItems.length}</span> products
              </p>
            ) : (
              <p className="text-lg">
                Showing <span className="font-semibold">{sortedItems.length}</span> products in {' '}
                <span className="font-semibold text-gray-600">
                  {categories.find(cat => cat.id === selectedCategory)?.label}
                </span>
              </p>
            )}
          </div>

          {/* Opsi Sorting */}
          <div className="flex -mb-5 justify-end">
            {/* Sort by Price */}
            <div className="relative flex flex-row p-4">
              <label htmlFor="sort-by-price" className={`${colors.text}`}>
                <FaSortAmountUp className="w-5 h-6" />
              </label>
              <select
                id="sort-by-price"
                name="sortByPrice"
                onChange={handleSortPriceChange}
                value={sortPrice}
                className={`-mt-1 block w-full ml-1 rounded-lg text-center ${colors.surface} ${colors.border} ${colors.text} shadow-md focus:${colors.primary} focus:ring focus:ring-gray-200 focus:ring-opacity-50`}
              >
                <option value="">None</option>
                <option value="highest">Highest</option>
                <option value="lowest">Lowest</option>
              </select>
            </div>

            {/* Sort by Date */}
            <div className="relative flex flex-row p-4">
              <label htmlFor="sort-by-date" className={`block ${colors.text}`}>
                <FaCalendarAlt className="w-5 h-6" />
              </label>
              <select
                id="sort-by-date"
                name="sortByDate"
                onChange={handleSortDateChange}
                value={sortDate}
                className={`-mt-1 block w-full ml-2 rounded-lg text-center ${colors.surface} ${colors.border} ${colors.text} shadow-md focus:${colors.primary} focus:ring focus:ring-gray-200 focus:ring-opacity-50`}
              >
                <option value="">None</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
        {/* Daftar Produk */}
        <div className="mt-6 grid grid-cols-1 font-serif gap-x-6 lg:mx-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 transition-all duration-500">
          {status === 'succeeded' && sortedItems.length > 0 ? (
            <ProductCard items={sortedItems} />
          ) : status === 'loading' ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-500 mb-4"></div>
              <p className={`${colors.text} text-lg`}>Loading products...</p>
            </div>
          ) : status === 'failed' ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className={`${colors.textMuted} text-6xl mb-4`}>📦</div>
              <p className={`${colors.textMuted} text-lg`}>
                {selectedCategory === 'all' 
                  ? 'No products found.' 
                  : `No products found in ${categories.find(cat => cat.id === selectedCategory)?.label}.`
                }
              </p>
              {selectedCategory !== 'all' && (
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
        {/* Komponen Lainnya */}
        <div id="bestseller">
          <Shop />
        </div>
        <div id="collections">
          <Collections />
        </div>
        <div id="review">
          <ReviewCard />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomeCostumer;
