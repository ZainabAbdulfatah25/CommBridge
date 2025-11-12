import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const apiKey = process.env.SIGNAPSE_API_KEY

    if (!apiKey) {
      console.error("SIGNAPSE_API_KEY is not configured")
      return NextResponse.json({ error: "Sign language API not configured" }, { status: 500 })
    }

    // Call Signapse API to get sign language video
    const response = await fetch("https://api.signapse.ai/v1/translate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        language: language.toLowerCase(),
        format: "video",
        avatar: "default",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Signapse API error:", errorData)
      return NextResponse.json({ error: "Failed to generate sign language video" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      videoUrl: data.videoUrl || data.url,
      avatarData: data.avatarData,
      message: "Sign language video generated successfully",
    })
  } catch (error) {
    console.error("Sign translation error:", error)
    return NextResponse.json({ error: "Failed to generate sign language video" }, { status: 500 })
  }
}
