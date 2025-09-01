import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from('images')
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  // Store under images/profiles/{userId}/random.ext
  // Uses the existing uploadImage helper which targets the 'images' bucket.
  return uploadImage(file, `profiles/${userId}`);
}

/**
 * Accepts either a storage path like "profiles/{userId}/file.png"
 * or a public URL like
 * https://{project}.supabase.co/storage/v1/object/public/images/profiles/{userId}/file.png
 * and deletes the file from the 'images' bucket.
 */
export async function deleteProfilePicture(storagePathOrPublicUrl: string): Promise<void> {
  // Try to normalize a public URL into a path within the 'images' bucket
  const normalizeToBucketPath = (input: string): string => {
    // If a full URL was provided, convert to pathname
    let path = input;
    try {
      const url = new URL(input);
      path = url.pathname;
    } catch {
      // not a URL; keep as-is
    }

    // Look for the public images prefix
    const publicPrefix = "/storage/v1/object/public/images/";
    const idx = path.indexOf(publicPrefix);
    if (idx !== -1) {
      return path.substring(idx + publicPrefix.length);
    }

    // If the path already starts with "images/", strip it so deleteImage()
    // doesn't end up with "images/images/..."
    return path.replace(/^images\//, "");
  };

  const bucketPath = normalizeToBucketPath(storagePathOrPublicUrl);
  await deleteImage(bucketPath);
}

// ---- Compatibility exports for profile pictures ----

/**
 * Upload a user's profile picture to Supabase Storage and return the public URL.
 * Stores under: images/profiles/{userId}/random.ext
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `profiles/${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (error) {
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a profile picture by its storage path or URL.
 */
export async function deleteProfilePicture(path: string): Promise<void> {
  const supabase = createClient();
  
  // Extract path from URL if needed
  let filePath = path;
  if (path.includes('/storage/v1/object/public/avatars/')) {
    filePath = path.split('/storage/v1/object/public/avatars/')[1];
  }
  
  const { error } = await supabase.storage
    .from('avatars')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete profile picture: ${error.message}`);
  }
}