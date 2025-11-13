"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import { PremiumLock } from "@/components/premium-lock"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FeatureNavTabs } from "@/components/feature-nav-tabs"

const FREE_DAILY_LIMIT = 10

interface VoiceTranslationClientProps {
  isPremium: boolean
}

export function VoiceTranslationClient({ isPremium }: VoiceTranslationClientProps) {
  const [language, setLanguage] = useState("English")
  const [inputText, setInputText] = useState("")
  const [spokenText, setSpokenText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [translationCount, setTranslationCount] = useState(0)
  const recognitionRef = useRef<any>(null)

  const hasReachedLimit = !isPremium && translationCount >= FREE_DAILY_LIMIT

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language === "Hausa" ? "ha" : language === "Arabic" ? "ar" : "en-US"

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setInputText((prev) => prev + finalTranscript)
          setSpokenText((prev) => prev + finalTranscript)
        } else if (interimTranscript) {
          setInputText((prev) => {
            const words = prev.split(" ")
            words[words.length - 1] = interimTranscript
            return words.join(" ")
          })
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, isListening])

  const toggleListening = () => {
    if (hasReachedLimit && !isListening) {
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      if (!isPremium) {
        setTranslationCount((prev) => prev + 1)
      }
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <FeatureNavTabs />

      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Voice to Text</h1>
            {!isPremium && (
              <div className="text-xs text-gray-600">
                Daily: {translationCount} / {FREE_DAILY_LIMIT}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Language:</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 sm:w-40 h-8">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          {hasReachedLimit ? (
            <PremiumLock
              feature="Unlimited Translations"
              description={`You've reached your daily limit of ${FREE_DAILY_LIMIT} translations. Upgrade to Premium for unlimited access.`}
            />
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* Input Section - Voice to Text */}
              <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Record Translation</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`Type or speak in ${language}...`}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 h-9 text-sm"
                    />
                    <button
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors flex-shrink-0 ${
                        isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-[#3b82f6] hover:bg-[#2563eb]"
                      }`}
                      onClick={toggleListening}
                      title={isListening ? "Stop listening" : "Click microphone to speak"}
                    >
                      <Mic className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isListening ? `🎤 Listening in ${language}...` : "Click microphone to start speaking"}
                  </p>
                </div>
              </div>

              {inputText && (
                <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Sign Language Display</h2>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setInputText("")
                        setSpokenText("")
                      }}
                      className="gap-1 h-8 text-xs"
                      size="sm"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Back
                    </Button>
                  </div>

                  {/* Real-time sign display */}
                  <div className="flex justify-center">
                    <div className="relative h-52 w-52 sm:h-64 sm:w-64 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                      <img
                        src="/sign-language-interpreter-displaying-words.jpg"
                        alt="Sign language display"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                        <p className="text-center font-semibold text-gray-800 text-xs sm:text-sm">
                          {spokenText.split(" ").slice(-1)[0] || inputText.split(" ").slice(-1)[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full text output */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-3">
                      {inputText}
                    </p>
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
