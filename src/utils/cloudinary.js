import axios from 'axios';

const CLOUDINARY_URL_IMAGE = 'https://api.cloudinary.com/v1_1/duk8twato/image/upload'; 
const CLOUDINARY_URL_AUTO = 'https://api.cloudinary.com/v1_1/duk8twato/auto/upload';
const UPLOAD_PRESET = 'e7fdrxuf'; 

export const uploadImage = async (imageFile, maxRetries = 3) => {
  if (!imageFile) {
    throw new Error("No image file provided for upload.");
  }

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    console.log(`Uploading image (attempt ${attempt}/${maxRetries}): ${imageFile.name}`);

    try {
      const response = await axios.post(CLOUDINARY_URL_IMAGE, formData, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`Upload successful on attempt ${attempt}:`, response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      lastError = error;
      
      // If not the last attempt, wait and retry
      if (attempt < maxRetries) {
        const delay = attempt * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Enhanced error reporting
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(`Upload failed: ${error.response.data?.error?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error("Network error: No response received from Cloudinary");
      } else {
        throw new Error(`Upload error: ${error.message}`);
      }
    }
  }
  
  throw lastError;
};

export const uploadFileCloudinary = async (file, maxRetries = 3) => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    console.log(`Uploading file (attempt ${attempt}/${maxRetries}): ${file.name}`);

    try {
      const response = await axios.post(CLOUDINARY_URL_AUTO, formData, {
        timeout: 60000, // 60 second timeout for larger files
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(`File upload successful on attempt ${attempt}:`, response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error(`File upload attempt ${attempt} failed:`, error);
      lastError = error;
      
      // If not the last attempt, wait and retry
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Longer delay for file uploads
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Enhanced error reporting
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        throw new Error(`File upload failed: ${error.response.data?.error?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error("Network error: No response received from Cloudinary");
      } else {
        throw new Error(`File upload error: ${error.message}`);
      }
    }
  }
  
  throw lastError;
};

export const uploadMultipleImagesCloudinary = async (files) => {
  if (!files || files.length === 0) return [];
  
  console.log(`Starting upload of ${files.length} images to Cloudinary`);
  
  // Upload files sequentially to avoid overwhelming the server
  const uploadedUrls = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      console.log(`Uploading image ${i + 1}/${files.length}: ${files[i].name}`);
      const url = await uploadImage(files[i]);
      uploadedUrls.push(url);
      
      // Small delay between uploads to prevent rate limiting
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error uploading image ${files[i].name}:`, error);
      throw new Error(`Failed to upload image: ${files[i].name}. ${error.message}`);
    }
  }
  
  console.log(`Successfully uploaded ${uploadedUrls.length} images to Cloudinary`);
  return uploadedUrls;
};

export const uploadMultiple3DCloudinary = async (files) => {
  if (!files || files.length === 0) return [];
  const uploadPromises = Array.from(files).map(file => uploadFileCloudinary(file));
  return Promise.all(uploadPromises);
};

// Function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/duk8twato/image/upload/v1234567890/folder/filename.jpg
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload/v{version}/' or 'upload/'
    let publicIdParts = parts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with 'v' followed by numbers)
    if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    // Join the remaining parts and remove file extension
    const publicIdWithExt = publicIdParts.join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    return lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
};

// Function to delete file from Cloudinary
export const deleteFileFromCloudinary = async (fileUrl) => {
  if (!fileUrl) return false;
  
  const publicId = extractPublicIdFromUrl(fileUrl);
  if (!publicId) {
    console.error('Could not extract public_id from URL:', fileUrl);
    return false;
  }

  try {
    // IMPORTANT: Deleting files from Cloudinary requires API key and secret
    // This operation should be performed on the backend for security reasons
    // For now, we'll use unsigned delete which only works with upload presets
    // that allow public deletion (not recommended for production)
    
    console.warn('⚠️  CLIENT-SIDE DELETION: For production, implement server-side deletion');
    console.log('Attempting to delete file with public_id:', publicId);

    // Method 1: Try unsigned deletion (works only if preset allows it)
    const deleteUrl = `https://api.cloudinary.com/v1_1/duk8twato/image/destroy`;
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('invalidate', 'true'); // Invalidate CDN cache

    const response = await axios.post(deleteUrl, formData);
    
    if (response.data.result === 'ok') {
      console.log('✅ File deleted successfully from Cloudinary:', publicId);
      return true;
    } else {
      console.warn('❌ File deletion failed:', response.data);
      // If unsigned deletion fails, log the issue but continue
      // In production, this should trigger a backend cleanup task
      console.warn('🔧 SOLUTION: Set up server-side deletion with API credentials');
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting file from Cloudinary:', error);
    if (error.response?.status === 401) {
      console.error('🔐 AUTHENTICATION ERROR: API Key and Secret required for deletion');
      console.error('📝 To fix: Set up backend endpoint for secure file deletion');
    }
    return false;
  }
};

// Function to delete multiple files from Cloudinary
export const deleteMultipleFilesFromCloudinary = async (fileUrls) => {
  if (!fileUrls || fileUrls.length === 0) return [];
  
  const deletePromises = fileUrls.map(url => deleteFileFromCloudinary(url));
  const results = await Promise.allSettled(deletePromises);
  
  return results.map((result, index) => ({
    url: fileUrls[index],
    success: result.status === 'fulfilled' && result.value,
    error: result.status === 'rejected' ? result.reason : null
  }));
};

// Alternative: Create a server-side deletion request
// This function can be used to queue deletion requests for server processing
export const queueFileForDeletion = async (fileUrl) => {
  if (!fileUrl) return false;
  
  const publicId = extractPublicIdFromUrl(fileUrl);
  if (!publicId) return false;

  try {
    // In a real application, this would send the deletion request to your backend
    // For now, we'll store it in localStorage for demonstration
    const pendingDeletions = JSON.parse(localStorage.getItem('pendingCloudinaryDeletions') || '[]');
    
    const deletionRequest = {
      publicId,
      fileUrl,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    pendingDeletions.push(deletionRequest);
    localStorage.setItem('pendingCloudinaryDeletions', JSON.stringify(pendingDeletions));
    
    console.log('📝 Queued file for server-side deletion:', publicId);
    return true;
  } catch (error) {
    console.error('Error queuing file for deletion:', error);
    return false;
  }
};

// Get pending deletions (for admin to process)
export const getPendingDeletions = () => {
  try {
    return JSON.parse(localStorage.getItem('pendingCloudinaryDeletions') || '[]');
  } catch {
    return [];
  }
};

// Clear pending deletions
export const clearPendingDeletions = () => {
  localStorage.removeItem('pendingCloudinaryDeletions');
};

// Multiple file upload with progress tracking
export const uploadMultipleImagesWithProgress = async (files, onProgress) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = Array.from(files).map(async (file, index) => {
    try {
      const url = await uploadImage(file);
      if (onProgress) {
        onProgress(index + 1, files.length);
      }
      return { success: true, url, file: file.name };
    } catch (error) {
      if (onProgress) {
        onProgress(index + 1, files.length, error);
      }
      return { success: false, error: error.message, file: file.name };
    }
  });
  
  return Promise.all(uploadPromises);
};
