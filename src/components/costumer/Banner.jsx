
import img from "../../assets/70s_Beatles.webp";
import { useTheme } from "../../contexts/ThemeContext";

const Banner = () => {
  const { colors,  button } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col justify-center lg:flex-row items-center lg:justify-between lg:px-32 px-5 pt-24 lg:pt-10 ${colors.background}`}>
      {/* content section  */}
      <div className="space-y-6 lg:w-1/2">
        <h1 className={`text-5xl font-bold leading-tight ${colors.text} w-full lg:w-3/4 animate-in slide-in-from-left duration-700`}>
          Discover & Define Your Own Fashion!
        </h1>
        <p className={`w-full lg:w-3/4 ${colors.textMuted} font-medium text-lg leading-relaxed animate-in slide-in-from-left duration-700 delay-200`}>
          Each item is a carefully chosen masterpiece, promising not just fashion but a
          reflection of your unique style and personality.
        </p>        <button className={`${button.primary} px-8 py-4 font-bold text-lg rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200`}>
          Shop Now
        </button>
      </div>

      {/* img section */}
      <div>
        <img 
          className="-ml-2 -mb-2 rounded-lg" 
          width={680} 
          src={img} 
          alt="Fashion collection showcase" 
        />
      </div>
    </div>
  );
};

export default Banner;