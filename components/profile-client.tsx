"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from "@supabase/supabase-js"
import { PremiumBadge } from "@/components/premium-badge"
import Link from "next/link"

interface ProfileClientProps {
  user: User
  profile: any
}

export function ProfileClient({ user, profile }: ProfileClientProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFavourites, setShowFavourites] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const isPremium = profile?.is_premium || false

  const handleSaveChanges = async () => {
    if (!displayName.trim()) {
      alert("Please fill in your display name")
      return
    }

    // TODO: Save to database
    alert("Changes saved successfully!")
  }

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }
    // TODO: Implement password change with Supabase
    alert("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowChangePassword(false)
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 lg:grid-cols-[350px_1fr]">
        {/* Left Side - Profile Card */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center p-6 sm:p-8">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32">
                <AvatarImage src="/placeholder.svg" className="object-cover" />
                <AvatarFallback>
                  {displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <PremiumBadge size="sm" />
                </div>
              )}
            </div>

            <h2 className="mb-2 text-center text-lg sm:text-xl font-bold">
              {displayName || user.email?.split("@")[0]}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{user.email}</p>

            {!isPremium && (
              <Button asChild className="mb-6 sm:mb-8 w-full bg-gradient-to-r from-yellow-400 to-amber-500">
                <Link href="/settings/premium">Upgrade to Premium</Link>
              </Button>
            )}

            <div className="w-full space-y-4">
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-50"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-5 w-5 text-[#3b82f6]" />
                <span className="font-medium">Notification</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-50"
                onClick={() => setShowFavourites(true)}
              >
                <Heart className="h-5 w-5 text-[#3b82f6]" />
                <span className="font-medium">Favourite</span>
              </button>
              <button
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-50"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="h-5 w-5 text-[#3b82f6]" />
                <span className="font-medium">Change Password</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Edit Form */}
        <Card className="h-fit">
          <CardContent className="p-6 sm:p-8">
            <form className="space-y-5 sm:space-y-6">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ""} disabled className="mt-2 bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setDisplayName(profile?.display_name || "")}
                >
                  Discard Changes
                </Button>
                <Button type="button" className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb]" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-2"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setCurrentPassword("")
                  setNewPassword("")
                  setConfirmPassword("")
                  setShowChangePassword(false)
                }}
              >
                Cancel
              </Button>
              <Button type="button" className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb]" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Placeholder dialogs for notifications and favourites */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">No new notifications</p>
        </DialogContent>
      </Dialog>

      <Dialog open={showFavourites} onOpenChange={setShowFavourites}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Favourites</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">No favourites yet</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
