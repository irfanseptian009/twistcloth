import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// Thunks untuk operasi async
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const querySnapshot = await getDocs(collection(db, 'items'));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
});

export const addItem = createAsyncThunk('items/addItem', async (newItem) => {
  const docRef = await addDoc(collection(db, 'items'), newItem);
  return { id: docRef.id, ...newItem };
});

export const updateItem = createAsyncThunk('items/updateItem', async (updatedItem) => {
  const { id, ...data } = updatedItem;
  const itemRef = doc(db, 'items', id);
  await updateDoc(itemRef, data);
  return updatedItem;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id) => {
  await deleteDoc(doc(db, 'items', id));
  return id;
});
