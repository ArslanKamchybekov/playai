import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "ak-c3eaeadb838944cfaec82e41129a71f3"
const USER_ID = "5jcbndHqeMg9yRPw95Ti5cVfNus2"
const API_URL = "https://api.play.ai/v1/tts/stream"

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed, temperature } = await request.json()

    if (!text || !voice) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AUTHORIZATION: API_KEY,
        "X-USER-ID": USER_ID,
      },
      body: JSON.stringify({
        model: "PlayDialog",
        text,
        voice,
        speed: speed || 1.0,
        temperature: temperature || 0.5,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("PlayAI API error:", errorData)
      return NextResponse.json({ error: "Failed to generate audio" }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    })
  } catch (error) {
    console.error("Error in TTS API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

