"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mic, Eye, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export function FeatureNavTabs() {
  const pathname = usePathname()

  const tabs = [
    { name: "Voice to Sign", icon: Mic, href: "/language", id: "voice" },
    { name: "Sign to Text", icon: Eye, href: "/sign", id: "sign" },
    { name: "Learning", icon: BookOpen, href: "/learning", id: "learning" },
  ]

  return (
    <div className="border-b bg-white sticky top-0 z-40">
      <div className="flex items-center gap-1 px-4 sm:px-6 lg:px-8 py-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = pathname.includes(tab.id) || (tab.id === "learning" && pathname === "/learning")
          const Icon = tab.icon

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap",
                isActive ? "border-[#3b82f6] text-[#3b82f6]" : "border-transparent text-gray-600 hover:text-gray-900",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
