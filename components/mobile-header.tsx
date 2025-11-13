"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import type { User } from "@supabase/supabase-js"

interface MobileHeaderProps {
  user: User
  profile: any
}

export function MobileHeader({ user, profile }: MobileHeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <div className="lg:hidden flex items-center gap-4 bg-white border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <span className="font-semibold text-lg">CommBridge</span>
      </div>

      {isSidebarOpen && (
        <div className="lg:hidden">
          <AppSidebar user={user} profile={profile} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
      )}
    </>
  )
}
