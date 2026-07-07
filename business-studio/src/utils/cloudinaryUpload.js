const CLOUDINARY_CLOUD = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
const UPLOAD_PRESET = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'business_studio').trim();

function assertCloudinaryConfig() {
  if (!CLOUDINARY_CLOUD) {
    throw new Error(
      'Cloudinary cloud name is not set. In Cloudinary go to Dashboard → Product environment credentials, copy "Cloud name", then set VITE_CLOUDINARY_CLOUD_NAME in your .env (local) or Vercel Environment Variables (production).'
    );
  }
}

export async function uploadToCloudinary(file, type = 'image') {
  assertCloudinaryConfig();

  const resourceType = type === 'image' ? 'image' : 'video';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', `business-studio/${type}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || 'Upload failed';
    if (/cloud_name/i.test(msg)) {
      throw new Error(
        `Invalid Cloudinary cloud name "${CLOUDINARY_CLOUD}". Copy the exact "Cloud name" from Cloudinary Dashboard → Product environment credentials (often looks like "dxxxxxx", not "BusinessStudio"). Update VITE_CLOUDINARY_CLOUD_NAME and redeploy.`
      );
    }
    if (/preset/i.test(msg)) {
      throw new Error(
        `Cloudinary upload preset "${UPLOAD_PRESET}" not found. In Cloudinary go to Settings → Upload → Upload presets, create an UNSIGNED preset named "${UPLOAD_PRESET}", then save.`
      );
    }
    throw new Error(msg);
  }

  return data.secure_url;
}

export async function uploadViaBackend(file, type, api) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  const res = await fetch(`${api}/api/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Upload failed');
  }
  return data.url;
}

/** Try backend upload first; fall back to direct Cloudinary if server env is missing. */
export async function uploadFile(file, type, api) {
  try {
    return await uploadViaBackend(file, type, api);
  } catch (err) {
    const msg = err.message || '';
    const useDirect =
      /not configured|Missing:|503|Must supply api_key|cloud_name/i.test(msg);
    if (useDirect) {
      return uploadToCloudinary(file, type);
    }
    throw err;
  }
}
