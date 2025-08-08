import { supabase } from "./supabase"

export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  try {
    // Create a unique file name
    const fileExtension = file.name.split(".").pop()
    const fileName = `profile-pictures/${userId}.${fileExtension}`

    // Upload the file to Supabase Storage
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true // Replace existing file if it exists
      })

    if (error) {
      throw error
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    throw new Error("Failed to upload profile picture")
  }
}

export async function deleteProfilePicture(userId: string): Promise<void> {
  try {
    // Delete the profile picture from Supabase Storage
    // List all files with this prefix to handle different extensions
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list('profile-pictures', {
        search: userId
      })

    if (listError) {
      throw listError
    }

    // Delete all matching files
    if (files && files.length > 0) {
      const filesToDelete = files.map((file: any) => `profile-pictures/${file.name}`)
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete)

      if (deleteError) {
        throw deleteError
      }
    }
  } catch (error) {
    console.error("Error deleting profile picture:", error)
    throw new Error("Failed to delete profile picture")
  }
}
