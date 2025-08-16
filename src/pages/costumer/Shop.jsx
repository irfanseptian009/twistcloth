
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BestSellerCard from "../../components/costumer/BestSellerCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchItems } from "../../store/features/items/ProductSlice";
import { useTheme } from "../../contexts/ThemeContext";

const Shop = () => {
const { colors } = useTheme();
const items = useSelector((state) => state.items.items);
const dispatch = useDispatch();

useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);


  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          arrows: true,
        },
      },
    ],
  };
  return (
    <div className={`min-h-screen flex flex-col justify-center lg:px-32 px-10 pt-14 ${colors.background}`}>
      {/* heading section */}
      <div className="text-center mb-8">
        <h1 className={`font-bold text-4xl ${colors.text} mb-4`}>
          Best Sellers
        </h1>
        <p className={`text-lg ${colors.textMuted}`}>
          Discover our most popular items
        </p>
      </div>

      {/* carousel section */}
      <div className="mt-8">
        <Slider {...settings}>
          {items.map((item, idx) => (
            <BestSellerCard items={item} key={idx} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Shop;