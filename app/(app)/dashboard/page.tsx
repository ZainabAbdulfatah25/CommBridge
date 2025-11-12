"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Globe } from "lucide-react"
import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"

const emptyChartData = [
  { day: "MON", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "TUE", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "WED", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "THUR", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "FRI", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "SAT", wordsLearned: 0, translation: 0, practiceSessions: 0 },
  { day: "SUN", wordsLearned: 0, translation: 0, practiceSessions: 0 },
]

export default function DashboardPage() {
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)

  const { user, userProgress, isNewUser, isLoading } = useUser()

  const chartData = useMemo(
    () =>
      emptyChartData.map((day, index) => ({
        ...day,
        wordsLearned: userProgress.wordsLearned[index] || 0,
        translation: userProgress.translations[index] || 0,
        practiceSessions: userProgress.practiceSessions[index] || 0,
      })),
    [userProgress],
  )

  const allRecentActivity = useMemo(() => userProgress.recentActivity || [], [userProgress.recentActivity])
  const allRecentAchievements = useMemo(() => userProgress.recentAchievements || [], [userProgress.recentAchievements])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b bg-white px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                  <AvatarImage src={user?.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user?.firstName?.[0] || "U"}
                    {user?.lastName?.[0] || "S"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">{user?.firstName || "User"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {isNewUser && allRecentActivity.length === 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Welcome to CommBridge, {user?.firstName}!</h2>
              <p className="text-gray-700">
                Start your sign language learning journey today. Check out the Learning section to begin your first
                lesson!
              </p>
            </CardContent>
          </Card>
        )}

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

        {/* Recent Activity and Achievements */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold">Recent Activity</CardTitle>
              {allRecentActivity.length > 4 && (
                <Button variant="link" className="text-sm" onClick={() => setShowActivityModal(true)}>
                  view more
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {allRecentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No activity yet. Start learning to see your progress here!</p>
                </div>
              ) : (
                allRecentActivity.slice(0, 4).map((activity, index) => (
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

          {/* Recent Achievements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold">Recent Achievements</CardTitle>
              {allRecentAchievements.length > 4 && (
                <Button variant="link" className="text-sm" onClick={() => setShowAchievementsModal(true)}>
                  view more
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {allRecentAchievements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No achievements yet. Complete lessons to earn badges!</p>
                </div>
              ) : (
                allRecentAchievements.slice(0, 4).map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 flex-shrink-0">
                        <Globe className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base truncate">{achievement.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{achievement.time}</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {achievement.accuracy}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">All Recent Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allRecentActivity.map((activity, index) => (
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

      <Dialog open={showAchievementsModal} onOpenChange={setShowAchievementsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">All Recent Achievements</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allRecentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{achievement.title}</p>
                    <p className="text-sm text-gray-500">{achievement.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {achievement.accuracy}
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
