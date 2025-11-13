"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { createBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { CheckCircle, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { PremiumBadge } from "@/components/premium-badge"

const learningModules = [
  { id: 1, title: "Basics", lessons: 12, slug: "basics" },
  { id: 2, title: "Numbers", lessons: 12, slug: "numbers" },
  { id: 3, title: "Phrases", lessons: 12, slug: "phrases" },
  { id: 4, title: "Advanced", lessons: 12, slug: "advanced" },
]

export default function LearningPage() {
  const { user, isPremium } = useAuth()
  const [progressMap, setProgressMap] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      loadProgress()
    }
  }, [user])

  const loadProgress = async () => {
    if (!user) return

    const { data: progressData } = await supabase.from("learning_progress").select("*").eq("user_id", user.id)

    const map = new Map(progressData?.map((p) => [p.module_name, p]) || [])
    setProgressMap(map)
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="h-full overflow-y-auto">
      {/* Tabs */}
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button asChild variant="outline" className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <Link href="/sign">Sign Detection</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <Link href="/language">Voice Translation</Link>
          </Button>
          <Button variant="default" className="flex-1 bg-[#3b82f6] text-white hover:bg-[#2563eb]">
            Learning
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            learningModules.map((module) => {
              const progress = progressMap.get(module.slug)
              const isCompleted = progress?.completed || false
              const progressPercentage = progress?.progress_percentage || 0
              const isPremiumModule = module.slug === "advanced"
              const canAccess = !isPremiumModule || isPremium

              return (
                <Card key={module.id} className="overflow-hidden">
                  <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{module.title}</h3>
                        {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
                        {isPremiumModule && <PremiumBadge size="sm" />}
                      </div>
                      <p className="text-base sm:text-lg text-gray-500 mb-2">{module.lessons} Lessons</p>
                      {progressPercentage > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                            <div
                              className="h-full bg-[#3b82f6] transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{progressPercentage}%</span>
                        </div>
                      )}
                    </div>
                    <Button
                      asChild={canAccess}
                      disabled={!canAccess}
                      size="lg"
                      className={
                        canAccess
                          ? "bg-[#3b82f6] px-8 sm:px-12 hover:bg-[#2563eb] text-white w-full sm:w-auto"
                          : "w-full sm:w-auto"
                      }
                      onClick={() => !canAccess && (window.location.href = "/settings/premium")}
                    >
                      {canAccess ? (
                        <Link href={`/learning/${module.slug}`}>
                          {isCompleted ? "Review" : progressPercentage > 0 ? "Continue" : "Start"}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Unlock Premium
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
