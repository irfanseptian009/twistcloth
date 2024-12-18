
import { useSelector, useDispatch } from 'react-redux';
import { deleteItem } from '../store/features/items/Action';
import { IoIosCreate, IoIosTrash } from "react-icons/io";


const ProductsTable = ({ onEdit }) => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteItem(id));
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Stock</th>
          <th className="py-2 px-4 border-b">Category ID</th>
          <th className="py-2 px-4 border-b">Description</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{item.name}</td>
            <td className="py-2 px-4 border-b">${item.price}</td>
            <td className="py-2 px-4 border-b">{item.stock}</td>
            <td className="py-2 px-4 border-b">{item.categoryId}</td>
            <td className="py-2 px-4 border-b">{item.description}</td>
            <td className="py-2 px-4 border-b flex space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                <IoIosCreate size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <IoIosTrash size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
