import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function PremiumBadge({ className, size = "md" }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-medium",
        sizeClasses[size],
        className,
      )}
    >
      <Crown className={size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} />
      Premium
    </span>
  )
}
