
import { FaStar, FaCartArrowDown } from "react-icons/fa";
import PropTypes from "prop-types";
import  {useNavigate}  from "react-router";
import { useTheme } from "../../contexts/ThemeContext";


function BestSellerCard({ items }) {
  const navigate = useNavigate();
  const { colors, glass, button } = useTheme();

  const handleCardClick = () => {
    navigate(`/home/detail/${items.id}`);
  };


  return (
    <div
      className={`max-w-[340px] shadow-xl mb-7 mx-auto border-none rounded-xl ${glass.background} ${glass.border} cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-lg group`}
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={items.image}
          alt={items.name}
          onClick={handleCardClick}
          className="h-64 2xl:h-auto w-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="text-center p-4">
        <h3 className={`font-bold mb-2 ${colors.text}`}>Best Seller</h3>
        <p className={`text-sm ${colors.textMuted} mb-3`}>{items.name}</p>
        <h4 className={`font-bold text-lg mb-4 ${colors.primary}`}>Rp{items.price}</h4>
        <div className="flex justify-center mb-4 gap-1">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} className="text-yellow-400 text-sm" />
          ))}
        </div>
        <button
          className={`${button.primary} shadow-xl font-medium w-full py-3 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95`}
        //   onClick={(e) => {
        //     e.stopPropagation();
        //     handleAddToCart(items.id);
        //   }}
        >
          <FaCartArrowDown className="mr-2" />
          Add To Cart
        </button>
      </div>
    </div>
  );
}

BestSellerCard.propTypes = {
  items: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default BestSellerCard;

