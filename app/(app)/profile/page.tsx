"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProfileClient } from "@/components/profile-client"

export default function ProfilePage() {
  const { user, profile } = useAuth()

  if (!user || !profile) return null

  return <ProfileClient user={user} profile={profile} />
}
