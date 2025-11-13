"use client"
import { requireAuth, getUserProfile } from "@/lib/auth"
import { VoiceTranslationClient } from "@/components/voice-translation-client"

type TabType = "sign-detection" | "voice-translation" | "learning"

export default async function VoiceTranslationPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)
  const isPremium = profile?.is_premium || false

  return <VoiceTranslationClient isPremium={isPremium} />
}
