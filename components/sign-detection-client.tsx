"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, SwitchCamera } from "lucide-react"
import { PremiumLock } from "@/components/premium-lock"
import { SignLanguageAvatar } from "@/components/sign-language-avatar"
import { TranslationTabs } from "@/components/translation-tabs"

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
      const randomSign = commonSigns[Math.floor(Math.random() * commonSigns.length)]
      const confidence = (Math.random() * 30 + 70).toFixed(1)

      setDetectedText((prev) => {
        const newText = prev ? `${prev} ${randomSign}` : randomSign
        console.log("[v0] Detected sign:", randomSign, "Confidence:", confidence + "%")
        return newText
      })
    }, 2000)
  }

  const stopCamera = () => {
    console.log("[v0] Stopping camera and detection")

    if (!isPremium) {
      setDetectionCount((prev) => prev + 1)
    }

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
    <div className="h-full bg-gray-50">
      <TranslationTabs
        currentTab="sign"
        isPremium={isPremium}
        usageText={!isPremium ? `Daily detections used: ${detectionCount} / ${FREE_DAILY_LIMIT}` : undefined}
      />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {hasReachedLimit ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <PremiumLock
              feature="Unlimited Sign Detection"
              description={`You've reached your daily limit of ${FREE_DAILY_LIMIT} detections. Upgrade to Premium for unlimited access and advanced AI-powered detection.`}
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
                <CardHeader>
                  <CardTitle>Sign Language Display</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    {detectedText ? (
                      <SignLanguageAvatar
                        currentWord={detectedText.split(" ").slice(-1)[0] || ""}
                        fullText={detectedText}
                        isAnimating={isDetecting}
                      />
                    ) : (
                      <div className="min-h-[256px] rounded-lg bg-gray-100 p-6 flex items-center justify-center">
                        <p className="text-gray-500">Start signing to see avatar display...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Text Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[256px] rounded-lg bg-gray-100 p-6">
                    <p className="text-gray-800">{detectedText || "Start signing to see detected text..."}</p>
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
