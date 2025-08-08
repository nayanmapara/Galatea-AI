import { createClient } from "./supabase/server"

// Upload profile picture to Supabase Storage
export async function uploadProfilePicture(file: File, userId: string): Promise<string> {
  const supabase = await createClient()
  
  // Create a unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}_${Date.now()}.${fileExt}`
  const filePath = `profile-pictures/${fileName}`

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('user-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload profile picture')
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('user-uploads')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// Delete profile picture from Supabase Storage
export async function deleteProfilePicture(filePath: string): Promise<void> {
  const supabase = await createClient()
  
  // Extract the path from the URL if it's a full URL
  const path = filePath.includes('/storage/v1/object/public/') 
    ? filePath.split('/storage/v1/object/public/user-uploads/')[1]
    : filePath

  const { error } = await supabase.storage
    .from('user-uploads')
    .remove([path])

  if (error) {
    console.error('Delete error:', error)
    throw new Error('Failed to delete profile picture')
  }
}

// Upload companion image
export async function uploadCompanionImage(file: File, companionId: string): Promise<string> {
  const supabase = await createClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${companionId}_${Date.now()}.${fileExt}`
  const filePath = `companion-images/${fileName}`

  const { data, error } = await supabase.storage
    .from('user-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload companion image')
  }

  const { data: urlData } = supabase.storage
    .from('user-uploads')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// Get file from storage
export async function getFileUrl(filePath: string): Promise<string> {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from('user-uploads')
    .getPublicUrl(filePath)

  return data.publicUrl
}
