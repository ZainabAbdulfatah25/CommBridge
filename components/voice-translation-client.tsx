"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import Link from "next/link"
import { PremiumLock } from "@/components/premium-lock"
import { PremiumBadge } from "@/components/premium-badge"

const FREE_DAILY_LIMIT = 10

interface VoiceTranslationClientProps {
  isPremium: boolean
}

export function VoiceTranslationClient({ isPremium }: VoiceTranslationClientProps) {
  const [language, setLanguage] = useState("English")
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [currentWord, setCurrentWord] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [translationCount, setTranslationCount] = useState(0)
  const recognitionRef = useRef<any>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [language])

  useEffect(() => {
    if (inputText) {
      const words = inputText.trim().split(" ").filter(Boolean)
      if (words.length > 0) {
        setWordIndex(0)
        setCurrentWord(words[0])

        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current)
        }

        animationIntervalRef.current = setInterval(() => {
          setWordIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % words.length
            setCurrentWord(words[nextIndex])
            return nextIndex
          })
        }, 800)
      }
    } else {
      setCurrentWord("")
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
      }
    }
  }, [inputText])

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
      {/* Tabs */}
      <div className="border-b bg-white px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 flex-1">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link href="/sign" prefetch={true}>
                Sign Detection
              </Link>
            </Button>
            <Button variant="default" className="flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]" asChild>
              <Link href="/language" prefetch={true}>
                Voice Translation
              </Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link href="/learning" prefetch={true}>
                Learning
              </Link>
            </Button>
          </div>
          {isPremium && <PremiumBadge className="ml-4" />}
        </div>
        {!isPremium && (
          <div className="text-sm text-gray-600 text-center">
            Daily translations used: {translationCount} / {FREE_DAILY_LIMIT}
          </div>
        )}
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

            {/* Sign Display - Text to Sign */}
            {inputText && (
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">Sign Language Display</h3>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-64 w-64 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    <div className="text-center animate-pulse">
                      <div className="text-7xl mb-2">🤟</div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 mx-4">
                        <p className="text-2xl font-bold text-gray-800">{currentWord}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full rounded-lg bg-gray-50 p-4">
                    <p className="text-center text-gray-700">{inputText}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
