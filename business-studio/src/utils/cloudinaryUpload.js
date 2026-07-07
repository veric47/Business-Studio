// Upload straight to Cloudinary from the browser — no .env needed for this to work.
const CLOUD = 'businessStudio';
const PRESET = 'BusinessStudio';

export async function uploadToCloudinary(file, type = 'image') {
  const resourceType = type === 'image' ? 'image' : 'video';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', PRESET);
  formData.append('folder', `business-studio/${type}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.secure_url;
}

/** Used by StudioBuilder — same as uploadToCloudinary. */
export function uploadFile(file, type) {
  return uploadToCloudinary(file, type);
}
