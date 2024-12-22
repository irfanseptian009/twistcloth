import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './features/items/ProductSlice';
import cartReducer from './features/cart/CartSlice';
import authReducer, { monitorAuthState } from '../store/auth/authSlice';

const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Mengabaikan path auth.user
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Memulai monitor status autentikasi
store.dispatch(monitorAuthState());

export default store;
