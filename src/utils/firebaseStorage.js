import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

// Upload file ke Firebase Storage
export const uploadFile = async (file, folder = "products") => {
  if (!file) throw new Error("No file provided");
  
  // Buat nama file unik dengan timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Upload multiple files
export const uploadMultipleFiles = async (files, folder = "products") => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = Array.from(files).map(file => uploadFile(file, folder));
  
  try {
    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
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
