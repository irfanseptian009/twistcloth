import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/duk8twato/image/upload'; 
const UPLOAD_PRESET = 'e7fdrxuf'; 

export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error("No image file provided for upload.");
  }

  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  console.log("Uploading image:", imageFile.name);

  try {
    const response = await axios.post(CLOUDINARY_URL, formData);
    console.log("Upload successful:", response.data);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
};
