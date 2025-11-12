"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

type TabType = "sign-detection" | "voice-translation" | "learning"

const learningModules = [
  { id: 1, title: "Basics", lessons: 12, slug: "basics" },
  { id: 2, title: "Numbers", lessons: 12, slug: "numbers" },
  { id: 3, title: "Phrases", lessons: 12, slug: "phrases" },
  { id: 4, title: "Advanced", lessons: 12, slug: "advanced" },
]

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<TabType>("learning")
  const router = useRouter()

  const handleStartLesson = (slug: string) => {
    router.push(`/learning/${slug}`)
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Tabs */}
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant={activeTab === "sign-detection" ? "default" : "outline"}
            className={
              activeTab === "sign-detection"
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            onClick={() => {
              setActiveTab("sign-detection")
              window.location.href = "/sign"
            }}
          >
            Sign Detection
          </Button>
          <Button
            variant={activeTab === "voice-translation" ? "default" : "outline"}
            className={
              activeTab === "voice-translation"
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            onClick={() => {
              setActiveTab("voice-translation")
              window.location.href = "/language"
            }}
          >
            Voice Translation
          </Button>
          <Button
            variant={activeTab === "learning" ? "default" : "outline"}
            className={
              activeTab === "learning"
                ? "flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                : "flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }
            onClick={() => setActiveTab("learning")}
          >
            Learning
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {learningModules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8">
                <div>
                  <h3 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">{module.title}</h3>
                  <p className="text-base sm:text-lg text-gray-500">{module.lessons} Lessons</p>
                </div>
                <Button
                  size="lg"
                  className="bg-[#3b82f6] px-8 sm:px-12 hover:bg-[#2563eb] text-white w-full sm:w-auto"
                  onClick={() => handleStartLesson(module.slug)}
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
