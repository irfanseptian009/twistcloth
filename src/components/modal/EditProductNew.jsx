import AddProduct from './AddProduct';
import PropTypes from 'prop-types';

const EditProduct = ({ currentItem, onClose }) => {
  return (
    <AddProduct 
      currentItem={currentItem}
      onClose={onClose}
    />
  );
};

EditProduct.propTypes = {
  currentItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryId: PropTypes.string,
    description: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default EditProduct;
