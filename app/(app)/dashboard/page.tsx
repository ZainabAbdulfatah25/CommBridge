"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardCharts } from "@/components/dashboard-charts"
import { useAuth } from "@/contexts/auth-context"
import { createBrowserClient } from "@/lib/supabase/client"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [learningProgress, setLearningProgress] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    const [progressResult, activityResult] = await Promise.all([
      supabase.from("learning_progress").select("*").eq("user_id", user.id),
      supabase
        .from("translation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    setLearningProgress(progressResult.data || [])
    setRecentActivity(activityResult.data || [])
    setLoading(false)
  }

  if (!user || !profile) return null

  const isNewUser = learningProgress.length === 0

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
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">
                  {profile?.display_name || user.email?.split("@")[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {isNewUser && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Welcome to CommBridge, {profile?.display_name || "there"}!</h2>
              <p className="text-gray-700">
                Start your sign language learning journey today. Check out the Learning section to begin your first
                lesson!
              </p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <DashboardCharts
            learningProgress={learningProgress}
            recentActivity={recentActivity}
            isPremium={profile?.is_premium || false}
          />
        )}
      </div>
    </div>
  )
}
