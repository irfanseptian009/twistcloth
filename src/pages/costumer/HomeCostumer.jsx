import { FaSortAmountUp, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchItems } from "../../store/features/items/ProductSlice";
import { Banner, Footer, ProductCard, ReviewCard } from "../../components/costumer";
import Collections from "./Collections";
import Shop from "./Shop";
import { useTheme } from "../../contexts/ThemeContext";

const HomeCostumer = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  // Mengambil data produk, status, dan error dari Redux store
  const items = useSelector(state => state.items.items);
  const status = useSelector(state => state.items.status);
  const error = useSelector(state => state.items.error);

  // State untuk opsi sorting
  const [sortPrice, setSortPrice] = useState('');
  const [sortDate, setSortDate] = useState('');

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

  // Menghitung daftar produk yang telah diurutkan berdasarkan opsi yang dipilih
  const sortedItems = useMemo(() => {
    let sorted = [...items];

    // Sorting berdasarkan harga
    if (sortPrice === 'highest') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortPrice === 'lowest') {
      sorted.sort((a, b) => a.price - b.price);
    }

    // Sorting berdasarkan tanggal
    if (sortDate === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortDate === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return sorted;
  }, [items, sortPrice, sortDate]);

  return (
    <>      <div className={`${colors.surfaceSecondary}`}>
        <Banner/>
      </div>
      <div className="container mx-auto mt-8 xl:p-18 lg:p-14 md:p-10 sm:p-6 p-4">
        {/* Judul Produk */}
        <h2 className={`text-2xl font-bold tracking-tight ${colors.text}`}>Products</h2>
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
              className={`-mt-1 block w-full ml-1 rounded-lg text-center ${colors.surface} ${colors.border} ${colors.text} shadow-md focus:${colors.primary} focus:ring focus:ring-purple-200 focus:ring-opacity-50`}
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
              className={`-mt-1 block w-full ml-2 rounded-lg text-center ${colors.surface} ${colors.border} ${colors.text} shadow-md focus:${colors.primary} focus:ring focus:ring-purple-200 focus:ring-opacity-50`}
            >
              <option value="">None</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        {/* Daftar Produk */}
        <div className="mt-6 grid grid-cols-1 font-serif gap-x-6 lg:mx-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {status === 'succeeded' && sortedItems.length > 0 ? (
            <ProductCard items={sortedItems} />
          ) : status === 'loading' ? (
            <p>Loading...</p>
          ) : status === 'failed' ? (
            <p>Error: {error}</p>
          ) : (
            <p>No products found.</p>
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
