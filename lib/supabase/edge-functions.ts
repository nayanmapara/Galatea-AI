import { createClient } from "@/lib/supabase/client"

export interface SwipeResult {
  success: boolean
  isMatch: boolean
  conversationId?: string
  error?: string
}

export interface CompanionResponse {
  response: string
  conversationId: string
  messageId: string
}

export interface RecommendationRequest {
  userId: string
  limit?: number
  excludeIds?: string[]
}

export interface ConversationRequest {
  companionId: string
  userMessage: string
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

// Process swipe decision and handle matching logic
export async function processSwipe(
  companionId: string,
  decision: 'like' | 'pass' | 'super_like'
): Promise<SwipeResult> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/process-swipe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        companionId,
        decision
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error processing swipe:', error)
    return {
      success: false,
      isMatch: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get personalized companion recommendations
export async function getRecommendations(
  limit: number = 10,
  excludeIds: string[] = []
): Promise<any[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-recommendations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        limit,
        excludeIds
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.companions || []
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
}

// Generate AI companion response
export async function generateCompanionResponse(
  request: ConversationRequest
): Promise<CompanionResponse> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-companion-response`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        companionId: request.companionId,
        userMessage: request.userMessage,
        conversationHistory: request.conversationHistory || []
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return {
      response: result.response,
      conversationId: result.conversationId,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('Error generating companion response:', error)
    throw error
  }
}

// Get user conversations
export async function getUserConversations(): Promise<any[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-conversations?userId=${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.conversations || []
  } catch (error) {
    console.error('Error getting conversations:', error)
    return []
  }
}

// Get specific conversation with messages
export async function getConversation(conversationId: string): Promise<any> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-conversations?userId=${user.id}&conversationId=${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.conversation
  } catch (error) {
    console.error('Error getting conversation:', error)
    return null
  }
}