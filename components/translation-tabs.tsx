import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PremiumBadge } from "@/components/premium-badge"

interface TranslationTabsProps {
  currentTab: "sign" | "voice" | "learning"
  isPremium?: boolean
  usageText?: string
}

export function TranslationTabs({ currentTab, isPremium, usageText }: TranslationTabsProps) {
  return (
    <div className="border-b bg-white px-4 py-4 md:px-8 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 flex-1">
          <Button
            variant={currentTab === "sign" ? "default" : "outline"}
            className={`flex-1 ${currentTab === "sign" ? "bg-[#3b82f6] text-white hover:bg-[#2563eb]" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            asChild
          >
            <Link href="/sign" prefetch={true}>
              Sign Detection
            </Link>
          </Button>
          <Button
            variant={currentTab === "voice" ? "default" : "outline"}
            className={`flex-1 ${currentTab === "voice" ? "bg-[#3b82f6] text-white hover:bg-[#2563eb]" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            asChild
          >
            <Link href="/language" prefetch={true}>
              Voice Translation
            </Link>
          </Button>
          <Button
            variant={currentTab === "learning" ? "default" : "outline"}
            className={`flex-1 ${currentTab === "learning" ? "bg-[#3b82f6] text-white hover:bg-[#2563eb]" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
            asChild
          >
            <Link href="/learning" prefetch={true}>
              Learning
            </Link>
          </Button>
        </div>
        {isPremium && <PremiumBadge className="ml-4" />}
      </div>
      {usageText && <div className="text-sm text-gray-600 text-center">{usageText}</div>}
    </div>
  )
}
