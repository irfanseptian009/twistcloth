import { useEffect } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Box, Typography, CircularProgress, Rating } from "@mui/material";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { fetchItems } from "../../store/features/items/Action.js"; // Redux Thunk
import bg from "../../assets/authbg.jpg";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, loading, error } = useSelector((state) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);
  
  const product = items.find(item => item.id === id);
  

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }
  

  if (!product) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">Produk tidak ditemukan</Typography>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          Kembali ke Toko
        </button>
      </Box>
    );
  }

  const colors = ["blue", "yellow", "red", "orange", ];

  return (
    <Box
      className="bg-gradient-to-r min-h-screen flex flex-col justify-center p-8"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
      }}
    >
      <button
        onClick={handleBackClick}
        className="text-gray-600 font-bold -mt-5 mb-2 flex text-start justify-start rounded"
      >
        <IoChevronBackCircleOutline className="h-6 w-6" />
        Back to shop
      </button>

      <div className="bg-gray-100 border-l border-gray-300 rounded-2xl shadow-2xl p-10 flex flex-col md:flex-row relative">
        <div className="absolute top-7 xl:top-10 right-10 flex space-x-10">
          <FaHeart className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer" />
          <FaShareAlt className="text-gray-400 hover:text-blue-500 text-2xl cursor-pointer" />
        </div>

        <Box className="md:w-1/2 flex flex-col items-center mb-8 md:mb-0">
          <div className="relative">
            <img src={product.image || "placeholder.jpg"} alt={product.name || "No Image"} className="w-96 h-96 object-contain rounded-lg" />
            <FiRefreshCcw className="absolute bottom-4 right-4 text-3xl text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
           {/* Image thumbnails */}
           <div className="flex  mt-4 justify-center gap-2">
              {[product.image, product.image, product.image, product.image].map(
                (img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                )
              )}
            </div>
        </Box>

        <Box className="md:w-1/2 md:pl-8 -ml-5 -mr-5 flex flex-col justify-between">
          <div>
            <Typography variant="h4" className="text-2xl w-64 font-bold mb-2">
              {product.name}
            </Typography>
            <Rating name="read-only" value={product.rating || 5} readOnly size="small" />
            <Typography variant="body1" className="mt-2 text-gray-600">
              {product.description}
            </Typography>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <Typography variant="body1" className="font-semibold mb-2">
                Size:
              </Typography>
              <div className="flex space-x-2">
                {[7, 8, 9, 10].map((size) => (
                  <button key={size} className="border border-gray-300 rounded-md px-3 py-1 text-gray-700">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Typography variant="body1" className="font-semibold mb-2">
                Color:
              </Typography>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <span key={color} className={`w-6 h-6 rounded-full bg-${color}-300 bg-${color}-400 bg-${color}-500 bg-${color}-600 bg-${color}-750 bg-${color}-800 bg-${color}-950   border border-gray-300`}></span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 justify-between">
            <div className="flex flex-col">
              <Typography variant="h5" className="text-2xl font-bold">
                Rp.{product.price.toLocaleString()}
              </Typography>
              <Typography variant="body1" className="text-gray-500 line-through">
                Rp.{(product.price + 150).toLocaleString()}
              </Typography>
            </div>
            <button className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-2">
              Buy Now
            </button>
          </div>
        </Box>
      </div>
    </Box>
  );
}
export default ProductDetail;
