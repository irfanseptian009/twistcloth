import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
// import { uploadImage } from '../../../utils/cloudinary';
// Thunks untuk operasi async

// Fetch Cart Items
export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId, { rejectWithValue }) => {
  try {
    const cartCollection = collection(db, 'carts', userId, 'items');
    const querySnapshot = await getDocs(cartCollection);
    const cartItems = [];
    querySnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });
    return cartItems;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Add Item to Cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, item }, { rejectWithValue }) => {
    try {
      // Validasi data sebelum dikirim
      const { productId, name, price, quantity, image } = item;
      if (!productId || !name || !price || !quantity || !image) {
        throw new Error("Data cart tidak lengkap.");
      }

      console.log("Menambahkan ke cart:", item);

      const cartCollection = collection(db, 'carts', userId, 'items');
      const docRef = await addDoc(cartCollection, {
        productId,
        name,
        price,
        quantity,
        image,
      });
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error saat menambahkan ke cart:", error);
      return rejectWithValue(error.message);
    }
  }
);


// Remove Item from Cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, itemId }, { rejectWithValue }) => {
  try {
    const itemDoc = doc(db, 'carts', userId, 'items', itemId);
    await deleteDoc(itemDoc);
    return itemId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Update Cart Item Quantity
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ userId, itemId, quantity }, { rejectWithValue }) => {
  try {
    const itemDoc = doc(db, 'carts', userId, 'items', itemId);
    await updateDoc(itemDoc, { quantity });
    return { id: itemId, quantity };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    carts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.carts = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.carts.push(action.payload);
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.carts = state.carts.filter(item => item.id !== action.payload);
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.carts.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.carts[index].quantity = action.payload.quantity;
        }
      });
  },
});

export default cartSlice.reducer;
