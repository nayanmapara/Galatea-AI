import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string;
  companionId: string;
  decision: 'like' | 'pass' | 'super_like';
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

    const { userId, companionId, decision }: RequestBody = await req.json()

    // Validate input
    if (!userId || !companionId || !decision) {
      throw new Error('Missing required fields: userId, companionId, decision')
    }

    if (!['like', 'pass', 'super_like'].includes(decision)) {
      throw new Error('Invalid decision. Must be one of: like, pass, super_like')
    }

    // Insert swipe decision
    const { error: swipeError } = await supabaseClient
      .from('swipe_decisions')
      .insert({
        user_id: userId,
        companion_id: companionId,
        decision: decision
      })

    if (swipeError) {
      // Check if it's a duplicate swipe
      if (swipeError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'You have already swiped on this companion' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
      throw new Error(`Failed to record swipe: ${swipeError.message}`)
    }

    let isMatch = false
    let conversationId = null

    // If it's a like or super_like, check if a match and conversation were created
    if (decision === 'like' || decision === 'super_like') {
      const { data: match } = await supabaseClient
        .from('matches')
        .select('id')
        .eq('user_id', userId)
        .eq('companion_id', companionId)
        .single()

      if (match) {
        isMatch = true

        // Get the conversation ID
        const { data: conversation } = await supabaseClient
          .from('conversations')
          .select('id')
          .eq('user_id', userId)
          .eq('companion_id', companionId)
          .single()

        conversationId = conversation?.id || null
      }
    }

    // Get updated user stats
    const { data: userStats } = await supabaseClient
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    return new Response(
      JSON.stringify({ 
        success: true,
        isMatch,
        conversationId,
        userStats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error processing swipe:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
