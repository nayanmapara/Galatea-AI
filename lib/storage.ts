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
