
import ReviewCard from "../../components/costumer/ReviewCard";

const Review = () => {
  return (
    <div className=" min-h-screen flex flex-col justify-center lg:px-32 px-5">
      {/* heading section */}
      <h1 className=" font-semibold text-center text-ExtraDarkColor text-4xl lg:mt-14 mt-24 ">
        Feedback Corner
      </h1>

      {/* review card section */}
      <div className=" flex flex-col items-center xl:flex-row lg:flex-row sm:flex-row gap-5 justify-center py-4 my-8">
        <ReviewCard />
      </div>
    </div>
  );
};

export default Review;