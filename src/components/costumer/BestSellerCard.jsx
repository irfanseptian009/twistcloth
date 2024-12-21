
import { FaStar, FaCartArrowDown } from "react-icons/fa";
import PropTypes from "prop-types";
import  {useNavigate}  from "react-router";


function BestSellerCard({ items }) {

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/home/detail/${items.id}`);
  };


  return (
    <div
      className="max-w-[340px] shadow-xl mb-7 mx-auto border-none  rounded-xl bg-white cursor-pointer"
  
    >
      <img
        src={items.image}
        alt={items.name}
        onClick={handleCardClick}
        className="h-64 2xl:h-auto w-full object-fit  rounded-xl "
      />

      <div className="text-center p-3">
        <h3 className="font-bold mb-1">Running Shoes</h3> {/* Or appropriate category */}
        <p className="text-sm text-gray-500 mb-2">{items.name}</p>
        <h4 className="font-bold text-black mb-3">Rp{items.price}</h4>
        <div className="flex justify-center mb-2">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} className="text-yellow-400" />
          ))}
        </div>
        <button
          className="bg-gray-500 hover:bg-amber-800 shadow-xl text-white font-normal w-full py-2 rounded-md flex items-center justify-center"
        //   onClick={(e) => {
        //     e.stopPropagation();
        //     handleAddToCart(items.id);
        //   }}
        >
          <FaCartArrowDown className="mr-2 " />
          Add To Card
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

