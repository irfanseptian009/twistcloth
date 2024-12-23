import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router";
import CartProduct from "./CartProduct";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems] = useState([]);

  const navigate = useNavigate();

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
    <nav className="bg-gray-200 text-black p-4 shadow-xl rounded-b-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <ScrollLink to="home" smooth={true} duration={500} className="text-xl font-bold">
          Twist&cloth
        </ScrollLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          <li>
            <ScrollLink to="home" smooth={true} duration={500}>
              Home
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="products" smooth={true} duration={500}>
              Products
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="bestseller" smooth={true} duration={500}>
              Best Seller
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="collections" smooth={true} duration={500}>
              Collections
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="review" smooth={true} duration={500}>
              Review
            </ScrollLink>
          </li>
        
        </ul>

         {/* Nav Icons */}
         <div className="flex items-center gap-5">
          <Menu as="div" className="relative">
            <Menu.Button>
              <FaUser size={25} className="text-DarkColor" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={`${
                      active && "bg-gray-100"
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Your Profile
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
  {({ active }) => (
    <div
      onClick={handleLogout}
      className={`${
        active ? "bg-gray-100" : ""
      } block px-4 py-2 text-sm text-gray-700 cursor-pointer`}
    >
      Logout
    </div>
  )}
</Menu.Item>

            </Menu.Items>
          </Menu>

          <div className="text-DarkColor relative" onClick={() => setShowCart(!showCart)}>
            <FaShoppingCart size={25} className="cursor-pointer" />
            {cartItems.length > 0 && (
              <div className="absolute top-[-15px] right-[-10px] bg-red-600 w-[22px] h-[20px] rounded-full text-white text-sm grid place-items-center">
                {calculateCartCount()}
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <AiOutlineClose className="text-xl" />
            ) : (
              <AiOutlineMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="lg:hidden flex flex-col bg-neutral-200 text-black left-0 top-16 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300">
          <ul className="md:hidden mt-4 space-y-2">
            <li className=" transform translate-y-4 transition-all duration-500 ease-out">
              <ScrollLink
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
                to="home"
              >
                Home
              </ScrollLink>
              <ScrollLink
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
                to="products"
              >
                Products
              </ScrollLink>
              <ScrollLink
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
                to="bestseller"
              >
                Best Seller
              </ScrollLink>
              <ScrollLink
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
                to="collections"
              >
                Collections
              </ScrollLink>
              <ScrollLink
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
                to="review"
              >
                Review
              </ScrollLink>
              <ScrollLink
                onClick={handleLogout}
                className="menu-item block py-2 px-4 text-black hover:bg-gray-100"
              >
                Logout
              </ScrollLink>
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
