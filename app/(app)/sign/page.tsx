"use client"
import { requireAuth, getUserProfile } from "@/lib/auth"
import { SignDetectionClient } from "@/components/sign-detection-client"

const commonSigns = ["Hello", "Thanks", "Yes", "No", "Please", "Help", "Good"]

export default async function SignDetectionPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const isPremium = profile?.is_premium || false

  return <SignDetectionClient isPremium={isPremium} />
}
