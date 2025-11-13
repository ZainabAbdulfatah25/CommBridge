import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { requireAuth, getUserProfile } from "@/lib/auth"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar user={user} profile={profile} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileHeader user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto bg-[#e8eaf0]">{children}</main>
      </div>
    </div>
  )
}
