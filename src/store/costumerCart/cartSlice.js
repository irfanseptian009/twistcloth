// src/store/customerCart/cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Thunk untuk mengambil data cart dari Firestore
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const cartsCollection = collection(db, 'carts');
  const cartSnapshot = await getDocs(cartsCollection);
  const carts = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  // Misalnya, mengambil cart terbaru atau berdasarkan user
  return carts.length > 0 ? carts[carts.length - 1].items : [];
});

// Thunk untuk memperbarui jumlah cart di Firestore
export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ cartId, newQuantity }) => {
    const cartDoc = doc(db, 'carts', cartId);
    await updateDoc(cartDoc, { quantity: newQuantity });
    return { cartId, newQuantity };
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], 
    status: 'idle',
    error: null,
  },
  reducers: {
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { cartId, newQuantity } = action.payload;
        const existingItem = state.items.find(item => item.id === cartId);
        if (existingItem) {
          existingItem.quantity = newQuantity;
        }
      });
  },
});

export const { removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
