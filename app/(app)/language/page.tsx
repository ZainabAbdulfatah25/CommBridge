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
  const [currentWord, setCurrentWord] = useState("")
  const [allWords, setAllWords] = useState<string[]>([])
  const recognitionRef = useRef<any>(null)

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

          const words = transcript.trim().split(/\s+/).filter(Boolean)
          if (words.length > 0) {
            setCurrentWord(words[words.length - 1])
            setAllWords(words)
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
  }, [language])

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setLanguage(newLanguage)
      if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      setCurrentWord("")
      setAllWords([])
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
        setCurrentWord("")
        setAllWords([])
        setInputText("")
      } catch (error) {
        console.warn("Could not start recognition:", error)
      }
    }
  }, [isRecording])

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
                onChange={(e) => {
                  setInputText(e.target.value)
                  const words = e.target.value.trim().split(/\s+/).filter(Boolean)
                  if (words.length > 0) {
                    setCurrentWord(words[words.length - 1])
                    setAllWords(words)
                  }
                }}
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

          <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
            <h3 className="mb-4 text-base md:text-lg font-semibold text-gray-900">Sign Language Interpreter</h3>
            <div className="flex min-h-[300px] md:min-h-[400px] flex-col items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-6 md:p-8">
              {currentWord ? (
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Avatar Display */}
                  <div className="relative">
                    <div className="h-48 w-48 md:h-64 md:w-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-2xl">
                      <div className="h-44 w-44 md:h-60 md:w-60 rounded-full bg-white flex items-center justify-center">
                        <div className="text-6xl md:text-8xl animate-bounce">🤟</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
                      <p className="text-sm font-medium">Interpreting...</p>
                    </div>
                  </div>

                  {/* Current Word Display */}
                  <div className="rounded-xl bg-white/90 backdrop-blur-sm p-6 md:p-8 shadow-lg border-2 border-blue-200 w-full max-w-2xl">
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-gray-500 mb-2 uppercase tracking-wide">Current Sign</p>
                      <p className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">{currentWord}</p>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs md:text-sm text-gray-500 mb-2 uppercase tracking-wide">Full Text</p>
                        <p className="text-base md:text-xl text-gray-700 leading-relaxed">{inputText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="h-48 w-48 md:h-64 md:w-64 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-6xl md:text-8xl opacity-50">🤟</div>
                  </div>
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
