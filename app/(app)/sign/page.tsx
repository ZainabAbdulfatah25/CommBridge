"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Volume2 } from "lucide-react"
import Link from "next/link"

type TabType = "sign-detection" | "voice-translation" | "learning"

export default function SignDetectionPage() {
  const [activeTab, setActiveTab] = useState<TabType>("sign-detection")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedText, setDetectedText] = useState("")
  const [currentWord, setCurrentWord] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

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

  const detectSign = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const detectedGesture = analyzeGesture(imageData)

    if (detectedGesture) {
      setCurrentWord(detectedGesture)
      setDetectedText((prev) => {
        const words = prev.trim().split(" ")
        if (words[words.length - 1] !== detectedGesture) {
          return prev ? `${prev} ${detectedGesture}` : detectedGesture
        }
        return prev
      })
    }
  }

  const analyzeGesture = (imageData: ImageData): string | null => {
    const signs = [
      "Hello",
      "Thank you",
      "Yes",
      "No",
      "Please",
      "Help",
      "Good",
      "Bad",
      "More",
      "Stop",
      "I",
      "You",
      "Love",
      "Happy",
      "Sad",
    ]
    const randomIndex = Math.floor(Math.random() * signs.length)

    // Simulate real-time detection with 60% success rate
    if (Math.random() > 0.4) {
      return signs[randomIndex]
    }

    return null
  }

  const handleStartDetection = async () => {
    if (isDetecting) {
      setIsDetecting(false)
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
        detectionIntervalRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    } else {
      try {
        setCameraError(null)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setIsDetecting(true)
        setDetectedText("")
        setCurrentWord("")

        detectionIntervalRef.current = setInterval(() => {
          detectSign()
        }, 1000)
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
            setCameraError("Camera access was denied. Please allow camera permissions and try again.")
          } else if (error.name === "NotFoundError") {
            setCameraError("No camera found on this device.")
          } else if (error.name === "NotReadableError") {
            setCameraError("Camera is already in use by another application.")
          } else {
            setCameraError("Unable to access camera. Please check your permissions and try again.")
          }
        } else {
          setCameraError("Unable to access camera. Please check your permissions and try again.")
        }
        console.warn("Camera access error:", error)
      }
    }
  }

  const handlePlayAudio = () => {
    if (detectedText && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(detectedText)
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="h-full">
      {/* Tabs */}
      <div className="border-b bg-white px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant={activeTab === "sign-detection" ? "default" : "outline"}
            className={
              activeTab === "sign-detection"
                ? "w-full sm:flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "w-full sm:flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            asChild
          >
            <Link href="/sign" prefetch={true}>
              Sign Detection
            </Link>
          </Button>
          <Button
            variant={activeTab === "voice-translation" ? "default" : "outline"}
            className={
              activeTab === "voice-translation"
                ? "w-full sm:flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "w-full sm:flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            asChild
          >
            <Link href="/language" prefetch={true}>
              Voice Translation
            </Link>
          </Button>
          <Button
            variant={activeTab === "learning" ? "default" : "outline"}
            className={
              activeTab === "learning"
                ? "w-full sm:flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "w-full sm:flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            asChild
          >
            <Link href="/learning" prefetch={true}>
              Learning
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Camera Section - Sign to Text */}
        <div className="mb-6 sm:mb-8 flex flex-col items-center justify-center space-y-4 sm:space-y-6 py-4 sm:py-8">
          {!isDetecting ? (
            <>
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 border-gray-300">
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              {cameraError && <p className="text-sm text-red-500 text-center px-4">{cameraError}</p>}
            </>
          ) : (
            <div className="relative w-full max-w-3xl">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {currentWord && (
                    <div className="rounded-lg bg-green-500/90 px-6 py-3 backdrop-blur-sm animate-pulse">
                      <p className="text-center text-lg font-bold text-white">{currentWord}</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                  <div className="rounded-lg bg-white/90 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
                    <p className="text-center text-xs sm:text-sm font-medium text-gray-800">
                      {isDetecting ? "Detecting signs in real-time..." : "Face the camera and start signing"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            size="lg"
            className={
              isDetecting
                ? "bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 w-full sm:w-auto"
                : "bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 sm:px-8 w-full sm:w-auto"
            }
            onClick={handleStartDetection}
          >
            {isDetecting ? "Stop Sign Detection" : "Start Sign Detection"}
          </Button>
        </div>

        {/* Output Sections */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Text Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Text Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] rounded-lg bg-gray-100 p-6">
                <p className="text-gray-800 text-lg">{detectedText || "Start signing to see detected text here..."}</p>
              </div>
            </CardContent>
          </Card>

          {/* Audio Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Audio Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-100">
                <button
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:bg-gray-50 disabled:opacity-50"
                  disabled={!detectedText}
                  onClick={handlePlayAudio}
                  title="Play detected text as audio"
                >
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
