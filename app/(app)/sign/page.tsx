"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Volume2, SwitchCamera } from "lucide-react"
import Link from "next/link"

const commonSigns = ["Hello", "Thanks", "Yes", "No", "Please", "Help", "Good"]

export default function SignDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedText, setDetectedText] = useState("")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = async () => {
    try {
      console.log("[v0] Start button clicked, requesting camera access")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      console.log("[v0] Camera stream obtained successfully")
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          console.log("[v0] Video metadata loaded")
          videoRef.current
            ?.play()
            .then(() => {
              console.log("[v0] Video playing successfully")
              startDetection()
            })
            .catch((err) => {
              console.error("[v0] Error playing video:", err)
            })
        }
      }
      setIsDetecting(true)
    } catch (err) {
      alert("Camera access denied or not available")
      console.error("[v0] Camera error:", err)
    }
  }

  const startDetection = () => {
    console.log("[v0] Starting sign detection simulation")
    detectionIntervalRef.current = setInterval(() => {
      // Simulate detecting a random sign
      const randomSign = commonSigns[Math.floor(Math.random() * commonSigns.length)]
      const confidence = (Math.random() * 30 + 70).toFixed(1) // 70-100% confidence

      setDetectedText((prev) => {
        const newText = prev ? `${prev} ${randomSign}` : randomSign
        console.log("[v0] Detected sign:", randomSign, "Confidence:", confidence + "%")
        return newText
      })
    }, 2000) // Detect every 2 seconds
  }

  const stopCamera = () => {
    console.log("[v0] Stopping camera and detection")

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        console.log("[v0] Stopped track:", track.kind)
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsDetecting(false)
  }

  const handleToggle = () => {
    if (isDetecting) {
      stopCamera()
    } else {
      startCamera()
    }
  }

  const switchCamera = async () => {
    stopCamera()
    const newMode = facingMode === "user" ? "environment" : "user"
    setFacingMode(newMode)
    setTimeout(() => startCamera(), 100)
  }

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full">
      {/* Tabs */}
      <div className="border-b bg-white px-8 py-6">
        <div className="flex gap-4">
          <Button variant="default" className="flex-1 bg-[#3b82f6]" asChild>
            <Link href="/sign">Sign Detection</Link>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/language">Voice Translation</Link>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/learning">Learning</Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Camera Section */}
        <div className="mb-8 flex flex-col items-center justify-center space-y-6 py-8">
          {!isDetecting ? (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-300">
              <Camera className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <div className="relative w-full max-w-3xl">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute top-4 right-4">
                  <Button size="icon" variant="secondary" className="rounded-full bg-white/90" onClick={switchCamera}>
                    <SwitchCamera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className={isDetecting ? "bg-red-500 hover:bg-red-600" : "bg-[#3b82f6] hover:bg-[#2563eb]"}
            onClick={handleToggle}
          >
            {isDetecting ? "Stop Sign Detection" : "Start Sign Detection"}
          </Button>
        </div>

        {/* Output Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Text Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] rounded-lg bg-gray-100 p-6">
                <p className="text-gray-800">{detectedText || "Start signing to see detected text..."}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audio Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-100">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                  <Volume2 className="h-8 w-8 text-gray-600" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
