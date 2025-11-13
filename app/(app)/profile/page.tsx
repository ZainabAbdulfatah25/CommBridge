"use client"
import { requireAuth, getUserProfile } from "@/lib/auth"
import { ProfileClient } from "@/components/profile-client"

export default async function ProfilePage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  return <ProfileClient user={user} profile={profile} />
}
