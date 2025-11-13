import { Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PremiumLockProps {
  feature: string
  description?: string
}

export function PremiumLock({ feature, description }: PremiumLockProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 mb-4">
        <Lock className="h-8 w-8 text-yellow-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature}</h3>
      {description && <p className="text-gray-600 mb-4 max-w-md">{description}</p>}
      <Button
        asChild
        className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white"
      >
        <Link href="/settings/premium">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Link>
      </Button>
    </div>
  )
}
