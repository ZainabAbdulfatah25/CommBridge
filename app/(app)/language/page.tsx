"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import Link from "next/link"

type TabType = "sign-detection" | "voice-translation" | "learning"

export default function VoiceTranslationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("voice-translation")
  const [language, setLanguage] = useState("English")
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [signVideoUrl, setSignVideoUrl] = useState<string | null>(null)
  const [isLoadingSign, setIsLoadingSign] = useState(false)
  const recognitionRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const languageMap = useRef<Record<string, string>>({
    English: "en-US",
    Hausa: "ha-NG",
    Pidgin: "en-NG",
    Arabic: "ar-SA",
  })

  const fetchSignLanguageVideo = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      setIsLoadingSign(true)
      try {
        // Using Signapse API or similar sign language translation service
        // For demo purposes, we'll use a placeholder API structure
        const response = await fetch("/api/sign-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }),
        })

        if (response.ok) {
          const data = await response.json()
          setSignVideoUrl(data.videoUrl)
        }
      } catch (error) {
        console.error("Error fetching sign language:", error)
      } finally {
        setIsLoadingSign(false)
      }
    },
    [language],
  )

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      if (!recognitionRef.current) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")
          setInputText(transcript)

          if (transcript.trim()) {
            fetchSignLanguageVideo(transcript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }
      }

      recognitionRef.current.lang = languageMap.current[language] || "en-US"
    }
  }, [language, fetchSignLanguageVideo])

  useEffect(() => {
    if (signVideoUrl && videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => console.warn("Video autoplay prevented:", err))
    }
  }, [signVideoUrl])

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage)
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      setSignVideoUrl(null)
    },
    [isRecording],
  )

  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please type instead.")
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
        setSignVideoUrl(null)
      } catch (error) {
        console.warn("Could not start recognition:", error)
      }
    }
  }, [isRecording])

  const handleTextTranslate = useCallback(() => {
    if (inputText.trim()) {
      fetchSignLanguageVideo(inputText)
    }
  }, [inputText, fetchSignLanguageVideo])

  return (
    <div className="h-full">
      {/* Tabs */}
      <div className="border-b bg-white px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <Button
            variant={activeTab === "sign-detection" ? "default" : "outline"}
            className={
              activeTab === "sign-detection"
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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
      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Language Selection and Input */}
          <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <label className="text-sm font-medium text-gray-700">Select Language:</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hausa">Hausa</SelectItem>
                  <SelectItem value="Pidgin">Pidgin</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="font-medium text-blue-700">Current: {language}</span>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextTranslate()}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base md:text-lg focus:border-[#3b82f6] focus:outline-hidden focus:ring-2 focus:ring-[#3b82f6]/20"
                placeholder={`Type or speak in ${language}...`}
              />
              <button
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                  isRecording ? "animate-pulse bg-red-500" : "bg-[#3b82f6]"
                } hover:opacity-90`}
                onClick={handleMicClick}
                title={isRecording ? "Stop recording" : "Click microphone to start speaking"}
              >
                <Mic className="h-6 w-6 text-white" />
              </button>
            </div>
            {isRecording && (
              <p className="mt-2 text-sm text-red-500 animate-pulse">🔴 Recording in {language}... Speak now</p>
            )}
          </div>

          {/* Sign Language Display - Real Interpreter */}
          <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 text-base md:text-lg font-semibold text-gray-900">Sign Language Interpreter</h3>
            <div className="flex min-h-[300px] md:min-h-[400px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-6 md:p-8">
              {isLoadingSign ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                  <p className="text-gray-600">Loading sign language interpretation...</p>
                </div>
              ) : signVideoUrl ? (
                <div className="w-full max-w-2xl">
                  <video ref={videoRef} className="w-full rounded-lg shadow-lg" controls autoPlay loop>
                    <source src={signVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="mt-4 rounded-lg bg-white/70 p-4 backdrop-blur-sm">
                    <p className="text-center text-sm md:text-base font-medium text-gray-800">{inputText}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-5xl md:text-6xl">🤟</div>
                  <p className="text-sm md:text-lg text-gray-500 px-4">
                    {isRecording
                      ? "Listening... Instant sign language will appear"
                      : "Click microphone to start speaking"}
                  </p>
                  <p className="text-xs text-gray-400">Real-time sign language interpretation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
