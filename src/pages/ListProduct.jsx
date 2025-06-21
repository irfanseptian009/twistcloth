import { useState, useEffect } from "react";
import ProductsTable from "../components/ProductsTable";
import Modal from '../components/modal/Modal';
import { IoIosAddCircleOutline } from "react-icons/io";
import AddProduct from "../components/modal/addProduct";
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../store/features/items/ProductSlice';
import { useTheme } from "../contexts/ThemeContext";
import { ThemeToggle } from "../components/UI/ThemeToggle";

const ListProduct = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.items.status);
  const { colors, glass, button } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${colors.background} p-4`}>
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle variant="floating" />
      </div>

      <div className="container mx-auto p-4 mt-1">
        <div className="flex flex-col">
          <div className={`${glass.background} ${glass.border} p-6 rounded-2xl shadow-2xl ${colors.text} mb-8 text-right relative backdrop-blur-lg`}>
            <h2 className={`text-3xl font-bold mb-4 text-center ${colors.text}`}>
              SELLER DASHBOARD
            </h2>
            <div className="text-center mb-4">
              <p className={`${colors.textMuted} text-lg`}>
                Manage your products and inventory
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${colors.textMuted} font-medium`}>
                Add new products to your store
              </span>
              <button
                onClick={openModal}
                className={`${button.primary} p-3 rounded-full hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg flex items-center gap-2`}
                title="Add New Product"
              >
                <IoIosAddCircleOutline className="w-6 h-6" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className={`${glass.background} ${glass.border} ${colors.text} rounded-2xl shadow-2xl mb-2 p-6 backdrop-blur-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-2xl font-bold ${colors.text}`}>Your Products</h3>
            <div className={`px-4 py-2 rounded-full ${colors.surfaceSecondary} text-sm font-medium`}>
              Total: {useSelector((state) => state.items.items).length} items
            </div>
          </div>
          <ProductsTable onEdit={handleEdit} />
        </div>        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}> 
          <AddProduct onClose={closeModal} currentItem={currentItem}/>
        </Modal>
      </div>
    </div>
  );
};

export default ListProduct;
