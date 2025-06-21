import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { uploadImage } from '../../../utils/cloudinary';

// Thunks untuk operasi async

// Fetch Items dengan sort options
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ sortByPrice, sortByDate } = {}, { rejectWithValue }) => {
    try {
      let q = collection(db, 'items');
      const queryConstraints = [];

      // Menambahkan orderBy untuk harga
      if (sortByPrice === 'highest') {
        queryConstraints.push(orderBy('price', 'desc'));
      } else if (sortByPrice === 'lowest') {
        queryConstraints.push(orderBy('price', 'asc'));
      }

      // Menambahkan orderBy untuk tanggal
      if (sortByDate === 'newest') {
        queryConstraints.push(orderBy('createdAt', 'desc'));
      } else if (sortByDate === 'oldest') {
        queryConstraints.push(orderBy('createdAt', 'asc'));
      }

      // Membuat query jika ada constraint
      if (queryConstraints.length > 0) {
        q = query(q, ...queryConstraints);
      }

      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ id: doc.id, ...data });
      });

      return items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk menambahkan item
export const addItem = createAsyncThunk(
  'items/addItem',
  async (item, { rejectWithValue }) => {
    try {
      const imageUrl = await uploadImage(item.image);
      const updatedItem = { ...item, image: imageUrl, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'items'), updatedItem);
      return { id: docRef.id, ...updatedItem };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk memperbarui item
export const updateItem = createAsyncThunk(
  'items/updateItem',
  async (item, { rejectWithValue }) => {
    try {
      if (item.image instanceof File) {
        const imageUrl = await uploadImage(item.image);
        item.image = imageUrl;
      }
      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, item);
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk menghapus item
export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Item
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Item
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;
