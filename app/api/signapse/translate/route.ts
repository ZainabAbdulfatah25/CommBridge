import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = "ASL" } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const apiKey = process.env.SIGNAPSE_API_KEY

    if (!apiKey) {
      console.log("[v0] SIGNAPSE_API_KEY not configured")
      // Return mock response for development
      return NextResponse.json({
        videoUrl: null,
        text: text,
        language: targetLanguage,
        mock: true,
      })
    }

    console.log("[v0] Calling Signapse API for translation:", text)

    // Call Signapse API to get sign language video translation
    const response = await fetch("https://api.signapse.ai/v1/translate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        format: "mp4",
      }),
    })

    if (!response.ok) {
      throw new Error(`Signapse API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Signapse API response received")

    return NextResponse.json({
      videoUrl: data.videoUrl,
      text: text,
      language: targetLanguage,
    })
  } catch (error) {
    console.error("[v0] Signapse API error:", error)
    return NextResponse.json(
      {
        error: "Failed to translate to sign language",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
