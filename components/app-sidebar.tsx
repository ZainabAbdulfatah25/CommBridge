"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Hand, Languages, GraduationCap, Settings, User, LogOut, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useCallback, useTransition } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sign", href: "/sign", icon: Hand },
  { name: "Language", href: "/language", icon: Languages },
  { name: "Learning", href: "/learning", icon: GraduationCap },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: User },
]

interface AppSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  user: SupabaseUser
  profile: any
}

export function AppSidebar({ isOpen = true, onClose, user, profile }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    if (onClose) onClose()
    startTransition(() => {
      router.push("/auth/login")
    })
  }, [onClose, router])

  return (
    <>
      {isOpen && onClose && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 flex h-screen w-[190px] flex-col bg-[#3b82f6] text-white transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/commbridge-logo.png" alt="CommBridge" fill className="object-contain" />
            </div>
            <span className="text-lg font-semibold">CommBridge</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden hover:bg-white/10 rounded p-1 transition-colors">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Log Out */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
            <span>{isPending ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </>
  )
}
