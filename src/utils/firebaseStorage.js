import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

// Upload file ke Firebase Storage dengan retry mechanism
export const uploadFile = async (file, folder = "products", maxRetries = 3) => {
  if (!file) throw new Error("No file provided");
  
  // Buat nama file unik dengan timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Upload attempt ${attempt} for file: ${fileName}`);
      
      // Add metadata to help with CORS
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedAt': new Date().toISOString(),
          'originalName': file.name
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log(`Upload successful on attempt ${attempt}`);
      return downloadURL;
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      lastError = error;
      
      // If it's a CORS error and not the last attempt, wait and retry
      if (attempt < maxRetries && (
        error.message.includes('CORS') || 
        error.message.includes('ERR_FAILED') ||
        error.code === 'storage/unknown'
      )) {
        console.log(`Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      // If it's the last attempt or not a retryable error, throw
      throw error;
    }
  }
  
  throw lastError;
};

// Upload multiple files dengan sequential upload untuk menghindari CORS issues
export const uploadMultipleFiles = async (files, folder = "products") => {
  if (!files || files.length === 0) return [];
  
  const downloadURLs = [];
  const filesArray = Array.from(files);
  
  console.log(`Starting upload of ${filesArray.length} files`);
  
  // Upload files sequentially to avoid overwhelming the server
  for (let i = 0; i < filesArray.length; i++) {
    try {
      console.log(`Uploading file ${i + 1}/${filesArray.length}: ${filesArray[i].name}`);
      const downloadURL = await uploadFile(filesArray[i], folder);
      downloadURLs.push(downloadURL);
      
      // Small delay between uploads to prevent rate limiting
      if (i < filesArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error uploading file ${filesArray[i].name}:`, error);
      throw new Error(`Failed to upload file: ${filesArray[i].name}. ${error.message}`);
    }
  }
  
  console.log(`Successfully uploaded ${downloadURLs.length} files`);
  return downloadURLs;
};

// Upload file 3D (GLB)
export const upload3DFile = async (file) => {
  if (!file) throw new Error("No 3D file provided");
  
  // Validasi ekstensi file
  const allowedExtensions = ['.glb', '.gltf'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("Only GLB and GLTF files are allowed");
  }
  
  return await uploadFile(file, "3d-models");
};

// Hapus file dari Firebase Storage
export const deleteFile = async (url) => {
  if (!url) return;
  
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Jangan throw error karena file mungkin sudah tidak ada
  }
};

// Extract file path from URL for deletion
export const getFilePathFromURL = (url) => {
  try {
    const urlParts = url.split('/');
    const pathWithToken = urlParts[urlParts.length - 1];
    const path = pathWithToken.split('?')[0];
    return decodeURIComponent(path);
  } catch (error) {
    console.error("Error extracting file path:", error);
    return null;
  }
};

// Alternative upload method with better CORS handling
export const uploadFileWithFallback = async (file, folder = "product-images") => {
  if (!file) throw new Error("No file provided");
  
  try {
    // First, try the normal upload
    return await uploadFile(file, folder);
  } catch (error) {
    console.error("Primary upload failed, trying alternative method:", error);
    
    // If CORS error, try with different approach
    if (error.message.includes('CORS') || error.message.includes('ERR_FAILED')) {
      try {
        // Use a different folder structure that might have different CORS settings
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}_${safeName}`;
        
        // Try uploading to root folder or different path
        const storageRef = ref(storage, fileName);
        
        const metadata = {
          contentType: file.type || 'application/octet-stream',
          customMetadata: {
            'originalFolder': folder,
            'uploadedAt': new Date().toISOString()
          }
        };
        
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        console.log("Alternative upload successful");
        return downloadURL;
      } catch (fallbackError) {
        console.error("Fallback upload also failed:", fallbackError);
        throw new Error(`Upload failed: ${fallbackError.message}. Please check your internet connection and try again.`);
      }
    }
    
    throw error;
  }
};

// Enhanced multiple file upload with fallback
export const uploadMultipleFilesWithFallback = async (files, folder = "product-images") => {
  if (!files || files.length === 0) return [];
  
  const downloadURLs = [];
  const filesArray = Array.from(files);
  
  console.log(`Starting enhanced upload of ${filesArray.length} files`);
  
  for (let i = 0; i < filesArray.length; i++) {
    try {
      console.log(`Uploading file ${i + 1}/${filesArray.length}: ${filesArray[i].name}`);
      const downloadURL = await uploadFileWithFallback(filesArray[i], folder);
      downloadURLs.push(downloadURL);
      
      // Delay between uploads
      if (i < filesArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error uploading file ${filesArray[i].name}:`, error);
      throw new Error(`Failed to upload file: ${filesArray[i].name}. ${error.message}`);
    }
  }
  
  console.log(`Successfully uploaded ${downloadURLs.length} files with enhanced method`);
  return downloadURLs;
};
