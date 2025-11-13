"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, SwitchCamera, Lock, ArrowLeft } from "lucide-react"
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
    <div className="h-full bg-gray-50">
      <FeatureNavTabs />

      {/* Header */}
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sign Detection</h1>
            {isPremium && <PremiumBadge size="md" />}
          </div>
          {!isPremium && (
            <div className="text-xs sm:text-sm text-gray-600">
              Daily detections: {detectionCount} / {FREE_DAILY_LIMIT}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {hasReachedLimit ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <PremiumLock
              feature="Unlimited Sign Detection"
              description={`You've reached your daily limit of ${FREE_DAILY_LIMIT} detections. Upgrade to Premium for unlimited access.`}
            />
          </div>
        ) : (
          <>
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
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-white/90"
                        onClick={switchCamera}
                      >
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
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Sign Language Display</CardTitle>
                    {detectedText && (
                      <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    {detectedText ? (
                      <div className="relative h-64 w-64 sm:h-80 sm:w-80 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                        <img
                          src="/sign-language-interpreter-showing-signs.jpg"
                          alt="Sign language display"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="min-h-[256px] rounded-lg bg-gray-100 p-6 flex items-center justify-center flex-col gap-3">
                        <Camera className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">Start signing to see display...</p>
                      </div>
                    )}
                  </div>
                  {detectedText && (
                    <div className="mt-4 text-center">
                      <p className="text-base sm:text-lg font-semibold text-gray-800">
                        {detectedText.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Text Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[256px] rounded-lg bg-gray-100 p-6 flex items-center justify-center">
                    {detectedText ? (
                      <p className="text-sm sm:text-base text-gray-800">{detectedText}</p>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Lock className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-500">Detected text will appear here...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
