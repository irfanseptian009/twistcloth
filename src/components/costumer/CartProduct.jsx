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

export default function CartProduct() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth(); // Asumsi Anda memiliki hook auth untuk mendapatkan user
  const userId = user?.uid; // Dapatkan userId dari user

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
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping Cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        onClick={() => setOpen(false)}
                      >
                        <span className="absolute -inset-0.5" />
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {carts.length > 0 ? (
                          carts.map((cart) => (
                            <li key={cart.id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={cart.image}
                                  alt={cart.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{cart.name}</h3>
                                    <p className="ml-4">Rp.{cart.price.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center">
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(cart.id, cart.quantity - 1)
                                      }
                                      disabled={cart.quantity <= 1}
                                    >
                                      <IoMdRemoveCircle className="text-xl" />
                                    </button>
                                    <span className="mx-2 font-semibold">
                                      {cart.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleQuantityChange(cart.id, cart.quantity + 1)
                                      }
                                    >
                                      <CgAddR className="text-xl" />
                                    </button>
                                  </div>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
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
                          <li className="py-6 text-center text-gray-500">
                            Your cart is empty.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>Rp.{totalPrice.toLocaleString()}</p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700">
                      BUY NOW
                    </button>
                    <button
                      className="mt-4 text-gray-500 hover:text-purple-700"
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
