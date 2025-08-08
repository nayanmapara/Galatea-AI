import { supabase } from "./supabase"

export interface AICompanion {
  id?: string
  name: string
  age: number
  personality: string
  interests: string[]
  bio: string
  imageUrl: string
  compatibilityScore?: number
  personalityTraits: string[]
  communicationStyle: string
  learningCapacity: string
  backstory: string
  favoriteTopics: string[]
  relationshipGoals: string[]
  createdAt?: Date
  updatedAt?: Date
}

export async function getAllCompanions(): Promise<AICompanion[]> {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data.map((companion: any) => ({
      ...companion,
      createdAt: companion.created_at ? new Date(companion.created_at) : undefined,
      updatedAt: companion.updated_at ? new Date(companion.updated_at) : undefined,
    })) as AICompanion[]
  } catch (error) {
    console.error("Error fetching companions:", error)
    throw new Error("Failed to fetch companions")
  }
}

export async function getCompanionById(id: string): Promise<AICompanion | null> {
  try {
    const { data, error } = await supabase
      .from('companions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No rows found
      }
      throw error
    }

    return {
      ...data,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    } as AICompanion
  } catch (error) {
    console.error("Error fetching companion:", error)
    throw new Error("Failed to fetch companion")
  }
}

export async function createCompanion(companion: Omit<AICompanion, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('companions')
      .insert([{
        ...companion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id')
      .single()

    if (error) {
      throw error
    }

    return data.id
  } catch (error) {
    console.error("Error creating companion:", error)
    throw new Error("Failed to create companion")
  }
}

export async function updateCompanion(id: string, updates: Partial<AICompanion>): Promise<void> {
  try {
    const { error } = await supabase
      .from('companions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error updating companion:", error)
    throw new Error("Failed to update companion")
  }
}

export async function deleteCompanion(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('companions')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting companion:", error)
    throw new Error("Failed to delete companion")
  }
}

export async function getRandomCompanions(count = 10): Promise<AICompanion[]> {
  try {
    const companions = await getAllCompanions()

    // Shuffle the array and return the requested number
    const shuffled = companions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error("Error fetching random companions:", error)
    throw new Error("Failed to fetch random companions")
  }
}
