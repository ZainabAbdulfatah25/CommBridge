"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, SwitchCamera, ArrowLeft } from "lucide-react"
import { PremiumLock } from "@/components/premium-lock"
import { PremiumBadge } from "@/components/premium-badge"
import { FeatureNavTabs } from "@/components/feature-nav-tabs"

const commonSigns = ["Hello", "Thanks", "Yes", "No", "Please", "Help", "Good"]
const FREE_DAILY_LIMIT = 5

interface SignDetectionClientProps {
  isPremium: boolean
}

export function SignDetectionClient({ isPremium }: SignDetectionClientProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectedText, setDetectedText] = useState("")
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [detectionCount, setDetectionCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const hasReachedLimit = !isPremium && detectionCount >= FREE_DAILY_LIMIT

  const startCamera = async () => {
    if (hasReachedLimit) {
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              startDetection()
            })
            .catch((err) => {
              console.error("Error playing video:", err)
            })
        }
      }
      setIsDetecting(true)
    } catch (err) {
      alert("Camera access denied or not available")
      console.error("Camera error:", err)
    }
  }

  const startDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      const randomSign = commonSigns[Math.floor(Math.random() * commonSigns.length)]
      setDetectedText((prev) => {
        const newText = prev ? `${prev} ${randomSign}` : randomSign
        return newText
      })
    }, 2000)
  }

  const stopCamera = () => {
    if (!isPremium) {
      setDetectionCount((prev) => prev + 1)
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
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

  const handleBack = () => {
    setDetectedText("")
    stopCamera()
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
    <div className="h-full w-full flex flex-col bg-gray-50">
      <FeatureNavTabs />

      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Sign to Text</h1>
            {isPremium && <PremiumBadge size="md" />}
          </div>
          {!isPremium && (
            <div className="text-xs text-gray-600">
              Daily: {detectionCount} / {FREE_DAILY_LIMIT}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {hasReachedLimit ? (
            <PremiumLock
              feature="Unlimited Sign Detection"
              description={`You've reached your daily limit of ${FREE_DAILY_LIMIT} detections. Upgrade to Premium for unlimited access.`}
            />
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* Camera Section */}
              <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Start Recording</h2>
                <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8">
                  {!isDetecting ? (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-300">
                      <Camera className="h-10 w-10 text-gray-400" />
                    </div>
                  ) : (
                    <div className="relative w-full max-w-xl">
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-900">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full bg-white/90 h-8 w-8 p-0"
                            onClick={switchCamera}
                          >
                            <SwitchCamera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className={isDetecting ? "bg-red-500 hover:bg-red-600" : "bg-[#3b82f6] hover:bg-[#2563eb]"}
                    onClick={handleToggle}
                  >
                    {isDetecting ? "Stop Recording" : "Start Recording"}
                  </Button>
                </div>
              </div>

              {/* Output Sections */}
              {detectedText && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Sign Language Display */}
                  <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">Sign Display</h2>
                      <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1 h-8 text-xs">
                        <ArrowLeft className="h-3 w-3" />
                        Back
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <div className="relative h-52 w-52 sm:h-64 sm:w-64 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        <img
                          src="/sign-language-interpreter-showing-signs.jpg"
                          alt="Sign language display"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-center font-semibold text-gray-800 text-xs sm:text-sm">
                            {detectedText.split(" ").slice(-1)[0]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Output */}
                  <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Text Output</h2>
                    <div className="min-h-52 rounded-lg bg-blue-50 p-4 flex items-center justify-center">
                      <p className="text-sm sm:text-base text-gray-800 text-center font-semibold line-clamp-5">
                        {detectedText}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
