import { NextResponse } from "next/server"
import { createBrowserClient } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const supabase = createBrowserClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { moduleName, progressPercentage, completed } = body

    const { data, error } = await supabase
      .from("learning_progress")
      .upsert(
        {
          user_id: user.id,
          module_name: moduleName,
          progress_percentage: progressPercentage,
          completed: completed || false,
          last_accessed: new Date().toISOString(),
        },
        {
          onConflict: "user_id,module_name",
        },
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
