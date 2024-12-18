import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../../store/features/items/Action';

const AddProduct = ({ onClose, currentItem }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    categoryId: '',
    description: '',
  });

  useEffect(() => {
    if (currentItem) {
      setForm({
        name: currentItem.name || '',
        price: currentItem.price || '',
        stock: currentItem.stock || '',
        categoryId: currentItem.categoryId || '',
        description: currentItem.description || '',
      });
    } else {
      setForm({
        name: '',
        price: '',
        stock: '',
        categoryId: '',
        description: '',
      });
    }
  }, [currentItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentItem) {
      await dispatch(updateItem({ id: currentItem.id, ...form }));
    } else {
      await dispatch(addItem(form));
    }
    onClose();
  };

  return (
    <div>
      <h4 className="text-center mb-4 font-bold text-lg">
        {currentItem ? 'Edit Product' : 'Add New Product'}
      </h4>
      <div className="py-1 px-5 rounded-xl font-thin shadow-xl border-2">
        <form onSubmit={handleSubmit} className="flex flex-col xl:grid xl:grid-cols-2 md:grid md:grid-cols-2 gap-4 text-start">
          {/* Bagian kiri form */}
          <div>
            <label className="block mb-2">
              <span className="text-gray-700">Name</span>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 border-2 w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Price</span>
              <input
                type="number"
                name="price"
                placeholder="Enter product price"
                value={form.price}
                onChange={handleChange}
                className="mt-1 border-2 w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Stock</span>
              <input
                type="number"
                name="stock"
                placeholder="Enter product stock"
                value={form.stock}
                onChange={handleChange}
                className="mt-1 border-2 w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-700">Category ID</span>
              <input
                type="text"
                name="categoryId"
                placeholder="Enter category ID"
                value={form.categoryId}
                onChange={handleChange}
                className="mt-1 border-2 w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </label>
          </div>

          {/* Bagian kanan form */}
          <div>
            <label className="block mb-2">
              <span className="text-gray-700">Description</span>
              <textarea
                name="description"
                placeholder="Enter product description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="mt-1 border-2 w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </label>
          </div>

          {/* Tombol Submit dan Update */}
          <div className="col-span-2 flex justify-end">
            {currentItem && (
              <button
                type="button"
                onClick={onClose}
                className="btn bg-gray-300 rounded-md p-2 m-2 w-auto text-black font-bold text-xs shadow-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn bg-slate-800 rounded-md p-2 m-2 w-auto text-white text-xs font-bold shadow-lg hover:bg-gray-600"
            >
              {currentItem ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
