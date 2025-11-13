"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Globe, Lock } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

const emptyChartData = [
  { day: "MON", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "TUE", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "WED", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "THUR", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "FRI", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "SAT", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "SUN", wordsLearned: 0, translation: 0, practiceSessions: 0 },
]

interface DashboardChartsProps {
  learningProgress: any[]
  recentActivity: any[]
  isPremium: boolean
}

export function DashboardCharts({ learningProgress, recentActivity, isPremium }: DashboardChartsProps) {
  const [showActivityModal, setShowActivityModal] = useState(false)

  const chartData = useMemo(() => {
    const data = [...emptyChartData]
    learningProgress.forEach((progress) => {
      const dayIndex = new Date(progress.last_accessed).getDay()
      if (dayIndex >= 0 && dayIndex < 7) {
        data[dayIndex].wordsLearned += 1
        data[dayIndex].practiceSessions += progress.completed ? 1 : 0
      }
    })
    return data
  }, [learningProgress])

  const formattedActivity = useMemo(() => {
    return recentActivity.map((activity) => ({
      title: `${activity.type} - ${activity.language}`,
      time: new Date(activity.created_at).toLocaleDateString(),
      accuracy: activity.output_text ? "Completed" : "In Progress",
    }))
  }, [recentActivity])

  const openModal = useCallback(() => setShowActivityModal(true), [])
  const closeModal = useCallback(() => setShowActivityModal(false), [])

  return (
    <>
      {/* Progress Chart */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">Your learning progress</CardTitle>
          <Button variant="outline" size="sm" className="text-gray-600 bg-transparent">
            7 days
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
              <span>Words Learned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#a855f7]" />
              <span>Translation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span>Practice Sessions</span>
            </div>
          </div>
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="wordsLearned" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="translation" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="practiceSessions" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl font-bold">Recent Activity</CardTitle>
            {formattedActivity.length > 4 && (
              <Button variant="link" className="text-sm" onClick={openModal}>
                view more
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {formattedActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No activity yet. Start learning to see your progress here!</p>
              </div>
            ) : (
              formattedActivity.slice(0, 4).map((activity, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{activity.title}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap ml-2">{activity.accuracy}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold">Premium Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPremium ? (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-medium mb-2">Premium Active</p>
                <p className="text-sm text-gray-500">You have access to all premium features</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Advanced Sign Detection</p>
                    <p className="text-xs text-gray-500">Real-time AI-powered detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Unlimited Translations</p>
                    <p className="text-xs text-gray-500">No daily limits on translations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Progress Analytics</p>
                    <p className="text-xs text-gray-500">Detailed insights and reports</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/settings/premium">Upgrade to Premium</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showActivityModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">All Recent Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formattedActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {activity.accuracy}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
