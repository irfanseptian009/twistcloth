import { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router";
import CartProduct from "./CartProduct";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeSelector } from "../UI/ThemeToggle";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/features/cart/CartSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { colors, glass, button } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.carts);
  const userId = user?.uid;

  const navigate = useNavigate();

  // Fetch cart when user is logged in
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = async () => {
     try {
         await signOut(auth);
         navigate("/"); 
       } catch (error) {
         console.error("Error saat logout:", error);
       }
  };
  const calculateCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <nav className={`${glass.background} ${glass.border} ${colors.text} p-4 shadow-xl rounded-b-2xl backdrop-blur-lg`}>
      <div className="container mx-auto flex justify-between items-center">
        <ScrollLink to="home" smooth={true} duration={500} className={`text-xl font-bold ${colors.text} cursor-pointer hover:scale-105 transition-transform duration-200`}>
          Darknessmerch
        </ScrollLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <ScrollLink 
              to="home" 
              smooth={true} 
              duration={500}
              className={`cursor-pointer hover:${colors.primary} transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:${colors.surfaceSecondary}`}
            >
              Home
            </ScrollLink>
          </li>
          <li>
            <ScrollLink 
              to="products" 
              smooth={true} 
              duration={500}
              className={`cursor-pointer hover:${colors.primary} transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:${colors.surfaceSecondary}`}
            >
              Products
            </ScrollLink>
          </li>
          <li>
            <ScrollLink 
              to="bestseller" 
              smooth={true} 
              duration={500}
              className={`cursor-pointer hover:${colors.primary} transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:${colors.surfaceSecondary}`}
            >
              Best Seller
            </ScrollLink>
          </li>
          <li>
            <ScrollLink 
              to="collections" 
              smooth={true} 
              duration={500}
              className={`cursor-pointer hover:${colors.primary} transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:${colors.surfaceSecondary}`}
            >
              Collections
            </ScrollLink>
          </li>          <li>
            <ScrollLink 
              to="review" 
              smooth={true} 
              duration={500}
              className={`cursor-pointer hover:${colors.primary} transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:${colors.surfaceSecondary}`}
            >
              Review
            </ScrollLink>
          </li>
       
        </ul>         {/* Nav Icons */}
         <div className="flex items-center gap-5">
          {/* Theme Toggle */}
          <ThemeSelector variant="inline" size="sm" />
          
          {/* User Authentication */}
          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className={`p-2 rounded-full ${button.ghost} transition-all duration-200 hover:scale-110`}>
                <FaUser size={20} className={`${colors.text}`} />
              </Menu.Button>
              <Menu.Items className={`absolute right-0 mt-2 w-48 origin-top-right ${glass.background} ${glass.border} rounded-md shadow-lg py-1 backdrop-blur-lg z-50`}>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? colors.surfaceSecondary : ""
                      } block px-4 py-2 text-sm ${colors.text} transition-colors duration-200`}
                    >
                      {user.email}
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      onClick={handleLogout}
                      className={`${
                        active ? colors.surfaceSecondary : ""
                      } block px-4 py-2 text-sm ${colors.text} cursor-pointer transition-colors duration-200`}
                    >
                      Logout
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/signin')}
                className={`px-4 py-2 text-sm ${button.secondary} rounded-lg transition-all duration-200`}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className={`px-4 py-2 text-sm ${button.primary} rounded-lg transition-all duration-200`}
              >
                Sign Up
              </button>
            </div>          )}

          {/* Shopping Cart - only show if user is logged in */}
          {user && (
            <div className={`${colors.text} relative p-2 rounded-full ${button.ghost} transition-all duration-200 hover:scale-110`} onClick={() => setShowCart(!showCart)}>
              <FaShoppingCart size={20} className="cursor-pointer" />
              {cartItems.length > 0 && (
                <div className="absolute top-[-5px] right-[-5px] bg-red-500 w-[20px] h-[20px] rounded-full text-white text-xs grid place-items-center animate-pulse">
                  {calculateCartCount()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg ${button.ghost} transition-all duration-200`}
          >
            {menuOpen ? (
              <AiOutlineClose className={`text-xl ${colors.text}`} />
            ) : (
              <AiOutlineMenu className={`text-xl ${colors.text}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className={`lg:hidden flex flex-col ${glass.background} ${glass.border} ${colors.text} left-0 top-16 font-semibold text-lg text-center pt-8 pb-4 gap-4 w-full h-fit transition-all duration-300 backdrop-blur-lg rounded-b-xl`}>
          <ul className="md:hidden mt-4 space-y-2">
            <li className="transform translate-y-4 transition-all duration-500 ease-out">
              <ScrollLink
                className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                to="home"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </ScrollLink>
              <ScrollLink
                className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                to="products"
                onClick={() => setMenuOpen(false)}
              >
                Products
              </ScrollLink>
              <ScrollLink
                className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                to="bestseller"
                onClick={() => setMenuOpen(false)}
              >
                Best Seller
              </ScrollLink>
              <ScrollLink
                className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                to="collections"
                onClick={() => setMenuOpen(false)}
              >
                Collections
              </ScrollLink>              <ScrollLink
                className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                to="review"
                onClick={() => setMenuOpen(false)}
              >
                Review
              </ScrollLink>              
              
              {/* Authentication buttons for mobile */}
              {user ? (
                <>
                  <div className={`menu-item block py-3 px-4 ${colors.textMuted} rounded-lg mx-4`}>
                    {user.email}
                  </div>
                  <div
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <RouterLink
                    to="/signin"
                    className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </RouterLink>
                  <RouterLink
                    to="/signup"
                    className={`menu-item block py-3 px-4 ${colors.text} hover:${colors.surfaceSecondary} rounded-lg mx-4 transition-all duration-200 cursor-pointer`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </RouterLink>
                </>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Cart Overlay */}
      {showCart && <CartProduct />}
    </nav>
  );
};

export default Navbar;
