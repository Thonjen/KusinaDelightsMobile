// contexts/cloudinary.js
export async function uploadImage(uri) {
    const CLOUD_NAME = 'dhqn7c08j';
    // Replace 'my_unsigned_preset' with your actual unsigned upload preset name
    const UPLOAD_PRESET = 'unsigned_preset';
  
    // Prepare FormData with file object
    const formData = new FormData();
    formData.append('file', {
      uri,                             
      type: 'image/jpeg',                
      name: `upload_${Date.now()}.jpg`
    });
    formData.append('upload_preset', UPLOAD_PRESET);
  
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudinary upload error:', error);
      throw new Error(`Upload failed: ${response.status}`);
    }
  
    const result = await response.json();
    return result.secure_url;
  }
  