
import ReviewCard from "../../components/costumer/ReviewCard";
import { useTheme } from "../../contexts/ThemeContext";

const Review = () => {
  const { colors } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col justify-center lg:px-32 px-5 ${colors.background}`}>
      {/* heading section */}
      <div className="text-center mb-12">
        <h1 className={`font-bold text-4xl lg:text-5xl ${colors.text} lg:mt-14 mt-24 mb-4`}>
          Feedback Corner
        </h1>
        <p className={`text-lg ${colors.textMuted} max-w-2xl mx-auto`}>
          Discover what our customers are saying about their shopping experience with us
        </p>
      </div>

      {/* review card section */}
      <div className="flex flex-col items-center xl:flex-row lg:flex-row sm:flex-row gap-5 justify-center py-4 my-8">
        <ReviewCard />
      </div>
    </div>  );
};

export default Review;