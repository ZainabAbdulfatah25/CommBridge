"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import { PremiumLock } from "@/components/premium-lock"

const FREE_DAILY_LIMIT = 10

interface VoiceTranslationClientProps {
  isPremium: boolean
}

export function VoiceTranslationClient({ isPremium }: VoiceTranslationClientProps) {
  const [language, setLanguage] = useState("English")
  const [inputText, setInputText] = useState("")
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
    <div className="h-full bg-gray-50">
      {/* Header with tabs */}
      <div className="border-b bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Voice to Sign Translation</h1>
          {!isPremium && (
            <div className="text-sm text-gray-600">
              Daily translations: {translationCount} / {FREE_DAILY_LIMIT}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-180px)] items-center justify-center p-4 md:p-8">
        {hasReachedLimit ? (
          <PremiumLock
            feature="Unlimited Translations"
            description={`You've reached your daily limit of ${FREE_DAILY_LIMIT} translations. Upgrade to Premium for unlimited access.`}
          />
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {/* Language Selection */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Select Language:</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
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

            {/* Input Section - Voice to Text */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder={`Type or speak in ${language}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1"
                  />
                  <button
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                      isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-[#3b82f6] hover:bg-[#2563eb]"
                    }`}
                    onClick={toggleListening}
                    title={isListening ? "Stop listening" : "Click microphone to speak"}
                  >
                    <Mic className="h-5 w-5 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {isListening ? `Listening in ${language}...` : "Click microphone to start speaking"}
                </p>
              </div>
            </div>

            {/* Sign Display Section */}
            {inputText && (
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Sign Language Display</h3>
                </div>
                <div className="flex justify-center">
                  <div className="relative h-80 w-80 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src="/sign-language-interpreter-displaying-words.jpg"
                      alt="Sign language display"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">{inputText}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
