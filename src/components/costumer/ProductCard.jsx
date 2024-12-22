import { FaStar } from "react-icons/fa";
import { CardContent, Typography } from "@mui/material";
import { FaCartArrowDown } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fetchItems } from "../../store/features/items/ProductSlice";
import { addToCart } from "../../store/features/cart/CartSlice";
import { useAuth } from "../../hooks/useAuth";

const ProductCard = () => {
  const { items, status, error } = useSelector((state) => state.items);
  const { user } = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchItems());
    }
  }, [dispatch, items.length]);

  const handleAddToCart = (item) => {
    if (!userId) {
      alert("Silakan login untuk menambahkan ke keranjang.");
      return;
    }

    const cartItem = {
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    };

    dispatch(addToCart({ userId, item: cartItem }));
  };

  const handleCardClick = (id) => {
    navigate(`/home/detail/${id}`);
  };

  if (status === "loading") {
    return <Typography>Loading products...</Typography>;
  }

  if (status === "failed") {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item.id)}
          className="mx-7 xl:mx-0 lg:-mx-1 rounded-t-3xl text-black shadow-2xl rounded-xl transition-transform duration-300 hover:scale-105"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-64 2xl:h-auto rounded-t-3xl w-full object-cover cursor-pointer -mb-5"
          />
          <CardContent>
            <div className="flex flex-col justify-center items-center">
              <Typography gutterBottom variant="h5" component="div">
                {item.name}
              </Typography>
            </div>
            <div className="flex bg flex-row items-center h-7 justify-between">
              <Typography variant="body2" color="text.secondary">
                Stock: {item.stock}
              </Typography>
            </div>
            <Typography className="font-medium text-md mb-2">
              Rp.{item.price.toLocaleString()}
            </Typography>
            <div className="flex gap-1 justify-between">
              <button
                className={`p-2 font-normal rounded-md flex -mb-2 ${
                  item.stock > 0
                    ? "bg-gray-500 text-white active:bg-amber-800"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                disabled={item.stock <= 0}
              >
                <FaCartArrowDown className="h-5 w-5" /> Add to cart
              </button>
              <div className="flex gap-1 items-center">
                <Typography>{item.rating || "5.0"}</Typography>
                <FaStar className="text-yellow-300" />
              </div>
            </div>
          </CardContent>
        </div>
      ))}
    </>
  );
};

export default ProductCard;
