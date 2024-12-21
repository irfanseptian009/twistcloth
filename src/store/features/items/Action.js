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
