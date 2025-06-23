import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { uploadImage } from '../../../utils/cloudinary';

// Thunks untuk operasi async
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const querySnapshot = await getDocs(collection(db, 'items'));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });

  return items;
});

export const addItem = createAsyncThunk('items/addItem', async (item) => {
  const imageUrl = await uploadImage(item.image);
  const updatedItem = { ...item, image: imageUrl };
  const docRef = await addDoc(collection(db, 'items'), updatedItem);
  return { id: docRef.id, ...updatedItem };
});

export const updateItem = createAsyncThunk('items/updateItem', async (item) => {
  if (item.image instanceof File) {
    const imageUrl = await uploadImage(item.image);
    item.image = imageUrl;
  }
  const itemRef = doc(db, 'items', item.id);
  await updateDoc(itemRef, item);
  return item;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id) => {
  await deleteDoc(doc(db, 'items', id));
  return id;
});


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
        state.error = action.error.message;
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