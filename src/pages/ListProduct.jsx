import { useState, useEffect } from "react";
import ProductsTable from "../components/ProductsTable";
import Modal from '../components/modal/Modal';
import { IoIosAddCircleOutline } from "react-icons/io";
import AddProduct from "../components/modal/addProduct";
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../store/features/items/ProductSlice';

const ListProduct = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.items.status);

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
    <div className="container mx-auto p-4 mt-1">
      <div className="flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-xl text-gray-500 mb-8 text-right relative">
          <h2 className="text-2xl font-bold mb-4 text-center">SELLER PAGE</h2>
          <span>Add Product here</span>
          <button
            onClick={openModal}
            className="absolute top-4 right-14 text-gray-500 hover:text-gray-800"
          >
            <IoIosAddCircleOutline className="w-12 h-12 text-black" />
          </button>
        </div>
      </div>
      <div className="h-auto text-black rounded-xl shadow-lg mb-2 cursor-pointer p-4">
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        <ProductsTable onEdit={handleEdit} />
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}> 
        <AddProduct onClose={closeModal} currentItem={currentItem}/>
      </Modal>
    </div>
  );
};

export default ListProduct;
