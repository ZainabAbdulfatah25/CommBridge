"use client"

import { useAuth } from "@/contexts/auth-context"
import { SignDetectionClient } from "@/components/sign-detection-client"

export default function SignDetectionPage() {
  const { profile } = useAuth()
  const isPremium = profile?.is_premium || false

  return <SignDetectionClient isPremium={isPremium} />
}
