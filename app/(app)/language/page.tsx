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
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const recognitionRef = useRef<any>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const languageMap = useRef<Record<string, string>>({
    English: "en-US",
    Hausa: "ha-NG",
    Pidgin: "en-NG",
    Arabic: "ar-SA",
  })

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

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [language])

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current)
    }

    if (inputText && isRecording) {
      setIsAnimating(true)
      const words = inputText.split(" ")
      let wordIndex = 0

      animationIntervalRef.current = setInterval(() => {
        if (wordIndex < words.length) {
          setCurrentWord(words[wordIndex])
          wordIndex++
        } else {
          wordIndex = 0
        }
      }, 800)
    } else {
      setIsAnimating(false)
      setCurrentWord("")
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [inputText, isRecording])

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage)
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      setInputText("")
      setIsAnimating(false)
      setCurrentWord("")
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
        setInputText("")
      } catch (error) {
        console.warn("Could not start recognition:", error)
      }
    }
  }, [isRecording])

  return (
    <div className="h-full bg-gray-50">
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
      <div className="flex h-[calc(100vh-180px)] items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Language Selection */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
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
          </div>

          {/* Sign Display - Exact match to learning module */}
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <div className="flex justify-center">
              <div className="relative h-80 w-80 overflow-hidden rounded-lg bg-gray-100">
                {isAnimating && inputText ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                    <div className="relative mb-4">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse shadow-lg" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-5xl">👋</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 animate-pulse mb-2">{currentWord}</p>
                    <p className="text-sm text-gray-600 text-center max-w-xs">{inputText}</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-6xl opacity-30">🤟</div>
                      <p className="text-sm text-gray-500">Click microphone to start speaking</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <div className="flex items-center justify-center gap-3">
                <p className="text-sm font-medium text-gray-700">Practice Speaking:</p>
                <button
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                    isRecording ? "animate-pulse bg-red-500" : "bg-[#3b82f6]"
                  } hover:opacity-90`}
                  onClick={handleMicClick}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Mic className="h-6 w-6 text-white" />
                </button>
              </div>
              {isRecording && (
                <div className="text-center">
                  <p className="text-sm text-red-500 animate-pulse">🔴 Recording in {language}...</p>
                </div>
              )}
              {inputText && !isRecording && (
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">You said:</p>
                  <p className="text-lg font-semibold text-gray-800">{inputText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
