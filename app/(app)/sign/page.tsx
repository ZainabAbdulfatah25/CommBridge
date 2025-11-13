"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Volume2, SwitchCamera } from "lucide-react"
import Link from "next/link"

type TabType = "sign-detection" | "voice-translation" | "learning"

const commonSigns = [
  "Hello",
  "Thanks",
  "Yes",
  "No",
  "Please",
  "Help",
  "Good",
  "Love",
  "Stop",
  "Sorry",
  "Friend",
  "Family",
  "Happy",
  "Sad",
]

export default function SignDetectionPage() {
  const [activeTab, setActiveTab] = useState<TabType>("sign-detection")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedText, setDetectedText] = useState("")
  const [currentWord, setCurrentWord] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const lastWordRef = useRef<string>("")

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const stopCamera = () => {
    console.log("[v0] Stopping camera and detection")
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
        console.log("[v0] Stopped track:", track.kind)
      })
      streamRef.current = null
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const detectSign = async () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.log("[v0] Video not ready yet")
      return
    }

    try {
      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (canvas.width === 0 || canvas.height === 0) {
        console.log("[v0] Invalid video dimensions")
        return
      }

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Get image data
      const imageData = canvas.toDataURL("image/jpeg", 0.8)

      console.log("[v0] Sending frame for detection")

      // Call detection API
      const response = await fetch("/api/signapse/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      })

      if (response.ok) {
        const data = await response.json()

        if (data.confidence > 0.7 && data.detectedSign) {
          console.log("[v0] Detected sign:", data.detectedSign, "confidence:", data.confidence)
          setCurrentWord(data.detectedSign)
          setConfidence(data.confidence)

          // Add to text output if it's a new word
          if (data.detectedSign !== lastWordRef.current) {
            lastWordRef.current = data.detectedSign
            setDetectedText((prev) => (prev ? `${prev} ${data.detectedSign}` : data.detectedSign))

            // Clear current word after 2 seconds
            setTimeout(() => {
              setCurrentWord("")
            }, 2000)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Detection error:", error)
    }
  }

  const startDetection = () => {
    console.log("[v0] Starting detection interval")
    // Run detection every 1.5 seconds
    detectionIntervalRef.current = setInterval(() => {
      detectSign()
    }, 1500)
  }

  const handleStartDetection = async () => {
    if (isDetecting) {
      // Stop detection
      console.log("[v0] Stop button clicked")
      setIsDetecting(false)
      stopCamera()
      lastWordRef.current = ""
      setCurrentWord("")
    } else {
      // Start detection
      try {
        console.log("[v0] Start button clicked, requesting camera access")
        setCameraError(null)
        setDetectedText("")
        setCurrentWord("")
        lastWordRef.current = ""

        // Request camera access with constraints
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        }

        console.log("[v0] Getting user media with constraints:", constraints)
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log("[v0] Camera stream obtained successfully")

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          console.log("[v0] Stream assigned to video element")

          // Wait for video to be ready
          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                console.log("[v0] Video metadata loaded")
                resolve()
              }
            }
          })

          // Start playing the video
          await videoRef.current.play()
          console.log("[v0] Video playing")

          setIsDetecting(true)

          // Start detection after a short delay
          setTimeout(() => {
            startDetection()
          }, 500)
        }
      } catch (error) {
        console.error("[v0] Camera error:", error)
        if (error instanceof Error) {
          if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
            setCameraError("Camera access denied. Please allow camera permissions in your browser.")
          } else if (error.name === "NotFoundError") {
            setCameraError("No camera found on this device.")
          } else if (error.name === "NotReadableError") {
            setCameraError("Camera is already in use by another application.")
          } else {
            setCameraError(`Camera error: ${error.message}`)
          }
        } else {
          setCameraError("Unable to access camera. Please check your browser settings.")
        }
      }
    }
  }

  const toggleCamera = async () => {
    if (!isDetecting) return

    console.log("[v0] Toggling camera")
    const newFacingMode = facingMode === "user" ? "environment" : "user"

    stopCamera()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      setFacingMode(newFacingMode)
      console.log("[v0] Switched to", newFacingMode, "camera")

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve()
          }
        })

        await videoRef.current.play()
        startDetection()
      }
    } catch (error) {
      console.error("[v0] Camera toggle error:", error)
      setCameraError("Unable to switch camera.")
    }
  }

  const handlePlayAudio = () => {
    if (detectedText && window.speechSynthesis) {
      console.log("[v0] Playing audio:", detectedText)
      const utterance = new SpeechSynthesisUtterance(detectedText)
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="h-full">
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

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
              {cameraError && <p className="text-sm text-red-500 text-center px-4 max-w-md">{cameraError}</p>}
            </>
          ) : (
            <div className="relative w-full max-w-3xl">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {currentWord && (
                    <div className="rounded-lg bg-green-500/90 px-6 py-3 backdrop-blur-sm animate-pulse">
                      <p className="text-center text-lg font-bold text-white">
                        {currentWord}
                        <span className="ml-2 text-sm opacity-80">({Math.round(confidence * 100)}%)</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
                    onClick={toggleCamera}
                  >
                    <SwitchCamera className="h-5 w-5 text-gray-700" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                  <div className="rounded-lg bg-white/90 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
                    <p className="text-center text-xs sm:text-sm font-medium text-gray-800">
                      Show your hand signs clearly to the camera
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
