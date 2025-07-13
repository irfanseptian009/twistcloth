import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { uploadImage, uploadFileCloudinary, uploadMultipleImagesCloudinary, deleteMultipleFilesFromCloudinary, queueFileForDeletion } from '../../../utils/cloudinary';

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
  try {
    let imageUrl = null;
    let additionalImages = [];
    let model3DUrl = null;
    let model3DVariants = [];
    
    // Upload main image
    if (item.image && item.image instanceof File) {
      imageUrl = await uploadImage(item.image);
    } else if (item.image) {
      imageUrl = item.image;
    }
    
    // Upload additional images
    if (item.additionalImages && item.additionalImages.length > 0) {
      const imageFiles = item.additionalImages.filter(img => img instanceof File);
      const imageUrls = item.additionalImages.filter(img => typeof img === 'string');
      
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadMultipleImagesCloudinary(imageFiles);
        additionalImages = [...imageUrls, ...uploadedUrls];
      } else {
        additionalImages = imageUrls;
      }
    }
    
    // Upload single 3D model (backward compatibility)
    if (item.model3D && item.model3D instanceof File) {
      model3DUrl = await uploadFileCloudinary(item.model3D);
    } else if (item.model3D) {
      model3DUrl = item.model3D;
    }
    
    // Upload multiple 3D model variants
    if (item.model3DVariants && item.model3DVariants.length > 0) {
      model3DVariants = await Promise.all(
        item.model3DVariants.map(async (variant) => {
          let modelUrl = variant.modelUrl;
          
          // Upload model file if it's a File object
          if (variant.modelFile && variant.modelFile instanceof File) {
            modelUrl = await uploadFileCloudinary(variant.modelFile);
          }
          
          return {
            id: variant.id,
            name: variant.name,
            colorName: variant.colorName,
            colorHex: variant.colorHex,
            description: variant.description || '',
            sizes: variant.sizes || [],
            modelUrl: modelUrl,
            isRequired: variant.isRequired || false
          };
        })
      );
    }
    
    const updatedItem = {
      ...item,
      image: imageUrl,
      additionalImages,
      model3D: model3DUrl,
      model3DVariants: model3DVariants,
      availableColors: item.availableColors || ['#000000'],
      availableSizes: item.availableSizes || ['M'],
      iframeUrl: item.iframeUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'items'), updatedItem);
    return { id: docRef.id, ...updatedItem };
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
});

export const updateItem = createAsyncThunk('items/updateItem', async (item) => {
  try {
    let imageUrl = item.image;
    let additionalImages = item.additionalImages || [];
    let model3DUrl = item.model3D;
    let model3DVariants = item.model3DVariants || [];
    
    // Upload main image if it's a new file
    if (item.image instanceof File) {
      imageUrl = await uploadImage(item.image);
    }
    
    // Upload additional images if any are new files
    if (item.additionalImages && item.additionalImages.length > 0) {
      const imageFiles = item.additionalImages.filter(img => img instanceof File);
      const imageUrls = item.additionalImages.filter(img => typeof img === 'string');
      
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadMultipleImagesCloudinary(imageFiles);
        additionalImages = [...imageUrls, ...uploadedUrls];
      } else {
        additionalImages = imageUrls;
      }
    }
    
    // Upload single 3D model if it's a new file (backward compatibility)
    if (item.model3D instanceof File) {
      model3DUrl = await uploadFileCloudinary(item.model3D);
    }
    
    // Upload multiple 3D model variants
    if (item.model3DVariants && item.model3DVariants.length > 0) {
      model3DVariants = await Promise.all(
        item.model3DVariants.map(async (variant) => {
          let modelUrl = variant.modelUrl;
          
          // Upload model file if it's a File object
          if (variant.modelFile && variant.modelFile instanceof File) {
            modelUrl = await uploadFileCloudinary(variant.modelFile);
          }
          
          return {
            id: variant.id,
            name: variant.name,
            colorName: variant.colorName,
            colorHex: variant.colorHex,
            description: variant.description || '',
            sizes: variant.sizes || [],
            modelUrl: modelUrl,
            isRequired: variant.isRequired || false
          };
        })
      );
    }
    
    const updatedItem = {
      ...item,
      image: imageUrl,
      additionalImages,
      model3D: model3DUrl,
      model3DVariants: model3DVariants,
      availableColors: item.availableColors || ['#000000'],
      availableSizes: item.availableSizes || ['M'],
      iframeUrl: item.iframeUrl || '',
      updatedAt: new Date().toISOString()
    };
    
    const itemRef = doc(db, 'items', item.id);
    await updateDoc(itemRef, updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id, { getState }) => {
  try {
    // Get item data for cleanup
    const state = getState();
    const item = state.items.items.find(item => item.id === id);
    
    // Delete from Firestore first
    await deleteDoc(doc(db, 'items', id));
    
    // Clean up files from Cloudinary (handle errors gracefully)
    if (item) {
      const filesToDelete = [];
      
      // Collect main image
      if (item.image && typeof item.image === 'string') {
        filesToDelete.push(item.image);
      }
      
      // Collect additional images
      if (item.additionalImages && item.additionalImages.length > 0) {
        item.additionalImages.forEach(imageUrl => {
          if (typeof imageUrl === 'string') {
            filesToDelete.push(imageUrl);
          }
        });
      }
      
      // Collect single 3D model (backward compatibility)
      if (item.model3D && typeof item.model3D === 'string') {
        filesToDelete.push(item.model3D);
      }
      
      // Collect 3D model variants
      if (item.model3DVariants && item.model3DVariants.length > 0) {
        item.model3DVariants.forEach(variant => {
          if (variant.modelUrl && typeof variant.modelUrl === 'string') {
            filesToDelete.push(variant.modelUrl);
          }
        });
      }
        // Delete all files from Cloudinary
      if (filesToDelete.length > 0) {
        console.log(`Deleting ${filesToDelete.length} files from Cloudinary for product: ${item.name}`);
        try {
          // Try direct deletion first
          const deleteResults = await deleteMultipleFilesFromCloudinary(filesToDelete);
          const successCount = deleteResults.filter(result => result.success).length;
          const failCount = deleteResults.length - successCount;
          
          console.log(`Cloudinary cleanup completed: ${successCount} deleted, ${failCount} failed`);
          
          // For failed deletions, queue them for server-side processing
          if (failCount > 0) {
            console.warn('Some files could not be deleted from Cloudinary. Queuing for server processing...');
            const failedFiles = deleteResults
              .filter(result => !result.success)
              .map(result => result.url);
            
            // Queue failed deletions for server processing
            for (const fileUrl of failedFiles) {
              await queueFileForDeletion(fileUrl);
            }
            
            console.log(`Queued ${failCount} files for server-side deletion`);
          }
        } catch (error) {
          console.warn('Error during Cloudinary cleanup. Queuing all files for server processing...', error);
          // If batch deletion fails, queue all files
          for (const fileUrl of filesToDelete) {
            await queueFileForDeletion(fileUrl);
          }
        }
      }
    }
    
    return id;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
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