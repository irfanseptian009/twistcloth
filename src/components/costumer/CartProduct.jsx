import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IoMdRemoveCircle } from "react-icons/io";
import { CgAddR } from "react-icons/cg";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartItem } from "../../store/features/cart/CartSlice";
import { useAuth } from "../../hooks/useAuth"; 
import { Typography } from "@mui/material";
import { useTheme } from "../../contexts/ThemeContext";

export default function CartProduct() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { colors, glass, button } = useTheme();
  const userId = user?.uid;

  const { carts, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ userId, itemId: cartId, quantity: newQuantity }));
  };

  const handleRemoveItem = (cartId) => {
    dispatch(removeFromCart({ userId, itemId: cartId }));
  };

  const totalPrice = carts.reduce((sum, cart) => sum + cart.quantity * cart.price, 0);

  if (status === "loading") {
    return <Typography>Loading cart...</Typography>;
  }

  if (status === "failed") {
    return <Typography>Error: {error}</Typography>;
  }
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700">
              <div className={`flex h-full flex-col overflow-y-scroll ${glass.background} ${glass.border} shadow-xl backdrop-blur-lg`}>
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className={`text-xl font-bold ${colors.text}`}>
                      Shopping Cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className={`relative -m-2 p-2 ${colors.textMuted} hover:${colors.text} rounded-full hover:bg-red-500/20 transition-all duration-200`}
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className={`-my-6 divide-y ${colors.borderLight}`}>
                        {carts.length > 0 ? (
                          carts.map((cart) => (
                            <li key={cart.id} className="flex py-6">
                              <div className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg ${colors.border} shadow-md`}>
                                <img
                                  src={cart.image}
                                  alt={cart.name}
                                  className="h-full w-full object-cover object-center rounded-lg"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className={`flex justify-between text-base font-medium ${colors.text}`}>
                                    <h3 className="font-semibold">{cart.name}</h3>
                                    <p className={`ml-4 ${colors.primary} font-bold`}>Rp.{cart.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${colors.surfaceSecondary}`}>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(cart.id, cart.quantity - 1)
                                      }
                                      disabled={cart.quantity <= 1}
                                      className={`${colors.text} hover:${colors.primary} transition-colors duration-200 disabled:opacity-50`}
                                    >
                                      <IoMdRemoveCircle className="text-xl" />
                                    </button>
                                    <span className={`mx-2 font-bold text-lg ${colors.text}`}>
                                      {cart.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(cart.id, cart.quantity + 1)
                                      }
                                      className={`${colors.text} hover:${colors.primary} transition-colors duration-200`}
                                    >
                                      <CgAddR className="text-xl" />
                                    </button>
                                  </div>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-red-500 hover:text-red-400 transition-colors duration-200"
                                      onClick={() => handleRemoveItem(cart.id)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className={`py-12 text-center ${colors.textMuted}`}>
                            <p className="text-lg">Your cart is empty.</p>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`border-t ${colors.borderLight} px-4 py-6 sm:px-6`}>
                  <div className={`flex justify-between text-lg font-bold ${colors.text} mb-6`}>
                    <p>Subtotal</p>
                    <p className={`${colors.primary}`}>Rp.{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="space-y-3">
                    <button className={`w-full ${button.primary} py-3 text-base font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95`}>
                      BUY NOW
                    </button>
                    <button
                      className={`w-full ${button.secondary} py-2 text-sm rounded-lg transition-all duration-200`}
                      onClick={() => {
                        setOpen(false);
                        navigate("/"); // Pastikan rute "/" adalah halaman shop Anda
                      }}
                    >
                      Back to Shop
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
