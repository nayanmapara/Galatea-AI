# Fix: Missing named exports in lib/storage.ts and lib/companions.ts

These two files are locked in this workspace. Please unlock them first:
- lib/storage.ts
- lib/companions.ts

Then replace their contents with the versions below (adds the required named exports without changing existing behavior).

---

## lib/storage.ts (add uploadProfilePicture and deleteProfilePicture)

\`\`\`ts
import { createClient } from "@/lib/supabase/client";

/**
 * Upload any image to the "images" bucket at the provided path.
 * Returns the public URL of the uploaded file.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).slice(2)}.${fileExt ?? "png"}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage.from("images").upload(filePath, file);
  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a file from the "images" bucket by its storage path.
 */
export async function deleteImage(path: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from("images").remove([path]);
  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * REQUIRED NAMED EXPORTS
 * uploadProfilePicture: convenience helper that stores a user's profile picture
 * under images/profiles/{userId}/...
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  return uploadImage(file, `profiles/${userId}`);
}

/**
 * deleteProfilePicture: pass-through to deleteImage. Accepts the storage path.
 */
export async function deleteProfilePicture(path: string): Promise<void> {
  return deleteImage(path);
}
\`\`\`

---

## lib/companions.ts (add getAllCompanions)

\`\`\`ts
import { createClient } from "@/lib/supabase/server";

export interface Companion {
  id: string;
  name: string;
  age: number;
  bio: string;
  personality: string[];
  interests: string[];
  conversation_style: string;
  image_url: string;
  created_at: string;
}

export async function getCompanions(): Promise<Companion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch companions: ${error.message}`);
  }

  return data || [];
}

export async function createCompanion(
  companion: Omit<Companion, "id" | "created_at">
): Promise<Companion> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companions")
    .insert([companion])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create companion: ${error.message}`);
  }

  return data;
}

export async function updateCompanion(
  id: string,
  updates: Partial<Companion>
): Promise<Companion> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update companion: ${error.message}`);
  }

  return data;
}

export async function deleteCompanion(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("companions").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete companion: ${error.message}`);
  }
}

/**
 * REQUIRED NAMED EXPORT
 * getAllCompanions: alias to the existing getCompanions for compatibility with callers.
 */
export const getAllCompanions = getCompanions;
\`\`\`

After you unlock and paste these contents into their respective files, redeploy the block.
