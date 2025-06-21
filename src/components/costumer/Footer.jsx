import { Link } from "react-scroll";
import { FaFacebook } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { useTheme } from "../../contexts/ThemeContext";

const Footer = () => {
  const { colors, glass } = useTheme();
  
  return (
    <footer className={`${glass.background} ${glass.border} ${colors.text} rounded-t-3xl mt-8 md:mt-0 backdrop-blur-lg shadow-2xl`}>
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className="mb-8 md:mb-0">
          <h1 className={`font-bold text-3xl pb-4 ${colors.text}`}>Darknessmerch</h1>
          <div className="flex gap-5 ml-3">
            <FaFacebook
              size={32}
              className={`hover:scale-110 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:text-blue-500`}
            />
            <RiTwitterXLine
              size={32}
              className={`hover:scale-110 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:text-blue-400`}
            />
            <RiInstagramFill
              size={32}
              className={`hover:scale-110 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:text-pink-500`}
            />
          </div>
        </div>
        
        <div className="mb-8 md:mb-0">
          <h1 className={`font-bold text-xl pb-4 pt-5 md:pt-0 ${colors.text}`}>Shop</h1>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              Products
            </Link>
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              Overview
            </Link>
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              Pricing
            </Link>
          </div>
        </div>
        
        <div className="mb-8 md:mb-0">
          <h1 className={`font-bold text-xl pb-4 pt-5 md:pt-0 ${colors.text}`}>Company</h1>
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              About us
            </Link>
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              Contact
            </Link>
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              News
            </Link>
            <Link
              to="/"
              spy={true}
              smooth={true}
              duration={500}
              className={`hover:scale-105 cursor-pointer transition duration-300 ease-in-out ${colors.textMuted} hover:${colors.primary}`}
            >
              Support
            </Link>
          </nav>
        </div>
        
        <div className="w-full md:w-1/4">
          <h1 className={`font-bold text-xl pb-4 pt-5 md:pt-0 ${colors.text}`}>Contact Us</h1>
          <nav className="flex flex-col gap-3">
            <Link 
              to="/" 
              spy={true} 
              smooth={true} 
              duration={500}
              className={`${colors.textMuted} hover:${colors.primary} transition-colors duration-200`}
            >
              123 Elm Street, Suite 456 Springfield, IL 62701 Konoha
            </Link>
            <Link 
              to="/" 
              spy={true} 
              smooth={true} 
              duration={500}
              className={`${colors.textMuted} hover:${colors.primary} transition-colors duration-200`}
            >
              Darknessmerch.com
            </Link>
            <Link 
              to="/" 
              spy={true} 
              smooth={true} 
              duration={500}
              className={`${colors.textMuted} hover:${colors.primary} transition-colors duration-200`}
            >
              +123-456-7890
            </Link>
          </nav>
        </div>
      </div>
        <div className={`border-t ${colors.borderLight} pt-6`}>
        <p className={`text-center py-4 ${colors.textMuted}`}>
          @copyright developed by
          <span className={`${colors.primary} font-semibold`}> irfan</span> | All rights reserved
        </p>
      </div>    </footer>
  );
};

export default Footer;