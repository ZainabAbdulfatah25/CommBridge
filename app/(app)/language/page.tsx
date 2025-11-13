"use client"

import { useAuth } from "@/contexts/auth-context"
import { VoiceTranslationClient } from "@/components/voice-translation-client"

export default function VoiceTranslationPage() {
  const { profile } = useAuth()
  const isPremium = profile?.is_premium || false

  return <VoiceTranslationClient isPremium={isPremium} />
}
