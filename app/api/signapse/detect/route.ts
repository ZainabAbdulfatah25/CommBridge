import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    const apiKey = process.env.SIGNAPSE_API_KEY

    if (!apiKey) {
      console.log("[v0] SIGNAPSE_API_KEY not configured - using mock detection")
      // Return mock detection for development
      const mockSigns = ["Hello", "Thanks", "Yes", "No", "Please", "Help", "Good"]
      const randomSign = mockSigns[Math.floor(Math.random() * mockSigns.length)]
      return NextResponse.json({
        detectedSign: randomSign,
        confidence: 0.75 + Math.random() * 0.2,
        mock: true,
      })
    }

    console.log("[v0] Calling Signapse API for detection")

    // Call Signapse API to detect sign language from image
    const response = await fetch("https://api.signapse.ai/v1/detect", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData,
        language: "ASL",
      }),
    })

    if (!response.ok) {
      throw new Error(`Signapse API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] Signapse detection response:", data)

    return NextResponse.json({
      detectedSign: data.sign,
      confidence: data.confidence,
    })
  } catch (error) {
    console.error("[v0] Signapse detection error:", error)
    return NextResponse.json(
      { error: "Failed to detect sign language", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
