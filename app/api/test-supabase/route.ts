import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test the connection by getting the current user
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error("Supabase connection error:", error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        message: "Failed to connect to Supabase" 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supabase connection successful",
      user: user ? { id: user.id, email: user.email } : null
    })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: "Server error" 
    }, { status: 500 })
  }
}
