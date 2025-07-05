import { FaStar } from "react-icons/fa";
import { CardContent, Typography } from "@mui/material";
import { FaCartArrowDown } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addToCart } from "../../store/features/cart/CartSlice";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTheme } from "../../contexts/ThemeContext";

const ProductCard = ({ items }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, glass, button } = useTheme();
  const userId = user?.uid;

  const cartItems = useSelector((state) => state.cart.carts);
  const handleAddToCart = (item) => {
    if (!userId) {
      toast.error("Silakan login untuk menambahkan ke keranjang.", {
        position: "top-right",
        autoClose: 3000,
      });
      // Redirect to signin page
      navigate("/signin");
      return;
    }

    const isItemInCart = cartItems.some(cartItem => cartItem.productId === item.id);

    if (isItemInCart) {
      toast.info("Produk sudah ditambahkan ke keranjang.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const cartItem = {
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    };

    dispatch(addToCart({ userId, item: cartItem }))
      .unwrap()
      .then(() => {
        toast.success("Produk berhasil ditambahkan ke keranjang.", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error(`Gagal menambahkan ke keranjang: ${error}`, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  const handleCardClick = (id) => {
    navigate(`/detail/${id}`);
  };
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item.id)}
          className={`mx-7 xl:mx-0 lg:-mx-1 mb-10 rounded-t-3xl ${glass.background} ${glass.border} ${colors.text} shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-3xl backdrop-blur-lg cursor-pointer group`}
        >
          <div className="relative overflow-hidden rounded-t-3xl">
            <img
              src={item.image}
              alt={item.name}
              className="h-64 2xl:h-auto rounded-t-3xl w-full object-cover -mb-5 transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardContent className={`${colors.surface} rounded-b-xl`}>
            <div className="flex flex-col justify-center items-center">
              <Typography 
                gutterBottom 
                variant="h5" 
                component="div"
                className={`${colors.text} font-bold text-center`}
              >
                {item.name}
              </Typography>
            </div>
            <div className="flex bg flex-row items-center h-7 justify-between">
              <Typography 
                variant="body2" 
                className={`${colors.textMuted}`}
              >
                Stock: {item.stock}
              </Typography>
            </div>
            <Typography className={`font-bold text-lg mb-3 ${colors.primary}`}>
              Rp.{item.price.toLocaleString()}
            </Typography>
            <div className="flex gap-3 justify-between items-center">
              <button
                className={`px-4 py-2 font-medium rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  item.stock > 0
                    ? `${button.primary} hover:scale-105 active:scale-95`
                    : `${button.disabled} cursor-not-allowed`
                }`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                disabled={item.stock <= 0}
              >
                <FaCartArrowDown className="h-4 w-4" /> 
                Add to cart
              </button>
              <div className={`flex gap-2 items-center px-3 py-1 rounded-full ${colors.surfaceSecondary}`}>
                <Typography className={`${colors.text} font-medium`}>
                  {item.rating || "5.0"}
                </Typography>
                <FaStar className="text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </div>
      ))}
    </>
  );
};



ProductCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      stock: PropTypes.string,
      rating: PropTypes.number,
    })
  ).isRequired,
};

export default ProductCard;
