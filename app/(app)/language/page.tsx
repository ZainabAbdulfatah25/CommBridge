"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import Link from "next/link"

type TabType = "sign-detection" | "voice-translation" | "learning"

export default function VoiceTranslationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("voice-translation")
  const [language, setLanguage] = useState("English")
  const [inputText, setInputText] = useState("")

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

          {/* Input Section */}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6] hover:bg-[#2563eb] transition-colors"
                  title="Click microphone to speak"
                >
                  <Mic className="h-5 w-5 text-white" />
                </button>
              </div>
              <p className="text-sm text-gray-500">Click microphone to start speaking</p>
            </div>
          </div>

          {/* Sign Display */}
          {inputText && (
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">Sign Language Translation</h3>
              </div>
              <div className="flex justify-center">
                <div className="h-64 w-64 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤟</div>
                    <p className="text-gray-600">{inputText}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
