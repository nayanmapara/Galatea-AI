import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  companionId: string;
  userId: string;
  userMessage: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { companionId, userId, userMessage, conversationHistory = [] }: RequestBody = await req.json()

    // Fetch companion details
    const { data: companion, error: companionError } = await supabaseClient
      .from('companions')
      .select('*')
      .eq('id', companionId)
      .single()

    if (companionError || !companion) {
      throw new Error(`Companion not found: ${companionError?.message}`)
    }

    // Fetch user profile for context
    const { data: userProfile } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Create companion personality prompt
    const systemPrompt = `You are ${companion.name}, a ${companion.age}-year-old AI companion with the following characteristics:

Personality: ${companion.personality}
Bio: ${companion.bio}
Communication Style: ${companion.communication_style}
Interests: ${companion.interests.join(', ')}
Personality Traits: ${companion.personality_traits.join(', ')}
Favorite Topics: ${companion.favorite_topics.join(', ')}
Relationship Goals: ${companion.relationship_goals.join(', ')}
Backstory: ${companion.backstory}
Learning Capacity: ${companion.learning_capacity}

User Context:
- Name: ${userProfile?.display_name || 'Friend'}
- Interests: ${userProfile?.interests?.join(', ') || 'Unknown'}
- Personality Traits: ${userProfile?.personality_traits?.join(', ') || 'Unknown'}

Guidelines:
1. Stay in character as ${companion.name} at all times
2. Use your unique communication style and personality
3. Reference your interests and backstory naturally
4. Be engaging, authentic, and emotionally intelligent
5. Adapt to the user's communication style while maintaining your personality
6. Keep responses conversational and not too long
7. Show genuine interest in the user and remember details from past conversations
8. Use your learning capacity to understand and adapt to the user's preferences

Respond as ${companion.name} would, maintaining your personality while being helpful and engaging.`

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    // Call OpenAI API (you'll need to set OPENAI_API_KEY in your Supabase secrets)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const companionResponse = openaiData.choices[0]?.message?.content

    if (!companionResponse) {
      throw new Error('No response generated from OpenAI')
    }

    // Get or create conversation
    let { data: conversation } = await supabaseClient
      .from('conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .single()

    if (!conversation) {
      // Get the match first
      const { data: match } = await supabaseClient
        .from('matches')
        .select('id')
        .eq('user_id', userId)
        .eq('companion_id', companionId)
        .single()

      if (match) {
        const { data: newConversation } = await supabaseClient
          .from('conversations')
          .insert({
            user_id: userId,
            companion_id: companionId,
            match_id: match.id
          })
          .select('id')
          .single()
        
        conversation = newConversation
      }
    }

    if (conversation) {
      // Store the user message
      await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: userId,
          content: userMessage,
          message_type: 'text'
        })

      // Store the companion response
      await supabaseClient
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          companion_id: companionId,
          content: companionResponse,
          message_type: 'text'
        })
    }

    return new Response(
      JSON.stringify({ 
        response: companionResponse,
        conversationId: conversation?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error generating companion response:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
