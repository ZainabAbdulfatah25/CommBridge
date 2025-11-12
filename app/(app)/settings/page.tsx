"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const settingsOptions = [
  { id: 1, title: "Language Settings", href: "/settings/language" },
  { id: 2, title: "Camera Settings", href: "/settings/camera" },
  { id: 3, title: "About", href: "/settings/about" },
  { id: 4, title: "Policies", href: "/settings/policies" },
]

export default function SettingsPage() {
  return (
    <div className="h-full p-8">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-8">
          <h2 className="mb-8 text-2xl font-bold">General Settings</h2>
          <div className="space-y-1">
            {settingsOptions.map((option) => (
              <Link
                key={option.id}
                href={option.href}
                prefetch={true}
                className="flex items-center justify-between rounded-lg px-4 py-4 text-lg transition-colors hover:bg-gray-50"
              >
                <span>{option.title}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
