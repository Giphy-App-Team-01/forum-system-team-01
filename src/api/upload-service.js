// This file contains the code to upload images to Cloudinary.

const CLOUD_NAME = "dsh2knw3t"; 
const UPLOAD_PRESET = "profile_pictures"; 


/**
 * Uploads an image file to Cloudinary.
 *
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<string|null>} - A promise that resolves to the secure URL of the uploaded image, or null if the upload fails.
 */
export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; 
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};
