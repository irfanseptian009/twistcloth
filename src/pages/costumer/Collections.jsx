
import img from "../../assets/Nirvana2.png";
import { useTheme } from "../../contexts/ThemeContext";

const Collections = () => {
  const { colors,  button } = useTheme();
  
  return (
    <div className={`h-screen rounded-xl lg:h-[50vh] flex flex-col justify-center lg:flex-row items-center ${colors.background} mt-14 lg:px-32 px-5`}>
      {/* img section */}
      <div className="flex justify-center w-full lg:w-2/4 pt-6">
        <div className={`  transition-transform duration-500`}>
          <img 
            src={img} 
            alt="Summer Collection Showcase" 
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* content section */}
      <div className="w-full lg:w-2/4 space-y-1  text-center lg:text-start">
        <h1 className={`text-5xl font-bold ${colors.text} leading-tight`}>
          Best Summer Collection
        </h1>
        <h3 className={`text-2xl font-semibold ${colors.primary}`}>
          Sale Get Up To 60% off
        </h3>
        <p className={`text-lg ${colors.textMuted} leading-relaxed`}>
          Clothes aren&apos;t just about covering up. They&apos;re about expressing who you are,
          embracing your unique style, and feeling your best. Our new collection is
          designed to empower you, to make you feel beautiful, confident, and ready to
          take on the world.
        </p>

        <button className={`${button.primary} px-8 py-4 font-bold text-lg rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200`}>
          Shop Now
        </button>
      </div>    </div>
  );
};

export default Collections;