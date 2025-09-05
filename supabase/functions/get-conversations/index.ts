import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  userId: string;
  conversationId?: string;
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

    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')
    const conversationId = url.searchParams.get('conversationId')

    if (!userId) {
      throw new Error('Missing required parameter: userId')
    }

    if (conversationId) {
      // Get specific conversation with messages
      const { data: conversation, error: conversationError } = await supabaseClient
        .from('conversations')
        .select(`
          *,
          companions:companion_id (
            id,
            name,
            image_url,
            personality,
            communication_style
          ),
          messages (
            id,
            content,
            message_type,
            sender_id,
            companion_id,
            is_read,
            created_at
          )
        `)
        .eq('id', conversationId)
        .eq('user_id', userId)
        .single()

      if (conversationError) {
        throw new Error(`Failed to fetch conversation: ${conversationError.message}`)
      }

      // Mark messages as read
      await supabaseClient
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .is('sender_id', null) // Only mark companion messages as read

      return new Response(
        JSON.stringify({ conversation }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )

    } else {
      // Get all conversations for the user
      const { data: conversations, error: conversationsError } = await supabaseClient
        .from('conversations')
        .select(`
          *,
          companions:companion_id (
            id,
            name,
            image_url,
            personality
          ),
          messages!inner (
            content,
            created_at,
            sender_id,
            companion_id
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false })

      if (conversationsError) {
        throw new Error(`Failed to fetch conversations: ${conversationsError.message}`)
      }

      // Get unread message counts for each conversation
      const conversationsWithUnread = await Promise.all(
        conversations.map(async (conversation) => {
          const { count } = await supabaseClient
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('is_read', false)
            .is('sender_id', null) // Only count companion messages

          return {
            ...conversation,
            unreadCount: count || 0,
            lastMessage: conversation.messages?.[0] || null
          }
        })
      )

      return new Response(
        JSON.stringify({ conversations: conversationsWithUnread }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
