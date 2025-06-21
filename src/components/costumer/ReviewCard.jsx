
import { ImQuotesLeft } from "react-icons/im";
import { useTheme } from "../../contexts/ThemeContext";

const ReviewCard = () => {
  const { colors, glass } = useTheme();
  
  // Sample user image URL
  const userImage =
    "https://tse4.mm.bing.net/th?id=OIP.1AYxQXXaC2nmlq2gHuKlogHaJQ&pid=Api&P=0&h=220";
  const userImage2 =
    "https://tse3.mm.bing.net/th?id=OIP.0OHbAGENXBFABKmP7vML7AHaJZ&pid=Api&P=0&h=220";
  const userImage3 =
    "https://tse4.mm.bing.net/th?id=OIP.RuVFMlGrIFvD-0VDyZr5kgHaJo&pid=Api&P=0&h=220";

  const reviews = [
    {
      id: 1,
      name: "Synster Gates",
      image: userImage,
      rating: 5,
      text: "I am absolutely in love with this dress! The fit is perfect, the fabric is so soft and comfortable, and the color is even more vibrant in person. I received so many compliments when I wore it out. It's definitely a new favorite in my wardrobe."
    },
    {
      id: 2,
      name: "Cristiano Ronaldo",
      image: userImage2,
      rating: 5,
      text: "This shirt is a good value for the price. The material is decent quality, and the design is simple but stylish. It fits true to size, but I wish it was a bit longer. Overall, I'm happy with my purchase and would recommend it to others."
    },
    {
      id: 3,
      name: "Lamine Yamal",
      image: userImage3,
      rating: 4,
      text: "Great quality products and excellent customer service. The delivery was fast and the packaging was perfect. I'm really satisfied with my purchase and will definitely shop here again!"
    }
  ];

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row py-7 px-7 gap-8">
      {reviews.map((review) => (
        <div 
          key={review.id}
          className={`${glass.background} ${glass.border} shadow-2xl flex flex-col w-full xl:w-1/3 md:w-1/2 rounded-xl p-6 cursor-pointer hover:shadow-3xl transition-all duration-300 hover:scale-105 backdrop-blur-lg group`}
        >
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={review.image}
                alt={`${review.name} Profile`}
                className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-500/50 group-hover:border-blue-500 transition-colors duration-200"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${colors.text} capitalize`}>{review.name}</h3>
              <p className={`text-sm ${colors.textMuted}`}>Verified Customer</p>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <span className="text-yellow-400 text-xl mr-2">
              {renderStars(review.rating)}
            </span>
            <span className={`text-sm ${colors.textMuted} font-medium`}>
              ({review.rating}/5)
            </span>
          </div>

          <div className="relative mb-4">
            <ImQuotesLeft className={`${colors.textMuted} absolute -top-2 -left-2 opacity-30`} size={24} />
            <p className={`${colors.text} leading-relaxed italic pl-6 relative z-10`}>
              "{review.text}"
            </p>
          </div>

          <div className={`mt-auto pt-4 border-t ${colors.borderLight} flex items-center justify-between`}>
            <div className={`text-xs ${colors.textMuted}`}>
              2 days ago
            </div>
            <div className="flex items-center space-x-1">
              <button className={`text-xs ${colors.textMuted} hover:${colors.primary} transition-colors duration-200`}>
                Helpful
              </button>
              <span className={`text-xs ${colors.textMuted}`}>•</span>
              <span className={`text-xs ${colors.textMuted}`}>12 likes</span>
            </div>
          </div>
        </div>      ))}
    </div>
  );
};

export default ReviewCard;