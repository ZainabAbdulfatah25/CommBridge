"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart, Lock, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"

export default function ProfilePage() {
  const { user, setUser } = useUser()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState("/placeholder.svg")

  const [showNotifications, setShowNotifications] = useState(false)
  const [showFavourites, setShowFavourites] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
      setPhone(user.phone)
      setProfileImage(user.profileImage)
    }
  }, [user])

  const originalValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  }

  const handleSaveChanges = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (user) {
      setUser({
        ...user,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        profileImage,
      })
    }

    alert("Changes saved successfully!")
  }

  const handleDiscardChanges = () => {
    setFirstName(originalValues.firstName)
    setLastName(originalValues.lastName)
    setEmail(originalValues.email)
    setPhone(originalValues.phone)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        setShowEditProfile(false)
      }
      reader.readAsDataURL(file)
    }
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
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }
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
                <AvatarImage src={profileImage || "/placeholder.svg"} className="object-cover" />
                <AvatarFallback>FS</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 rounded-full bg-[#8b5cf6] px-2 sm:px-3 py-1 text-xs text-white shadow-lg hover:bg-[#7c3aed] transition-colors whitespace-nowrap">
                Upgrade to Pro
              </button>
            </div>

            <h2 className="mb-2 text-center text-lg sm:text-xl font-bold">
              {firstName} {lastName}
            </h2>
            <Button
              variant="outline"
              className="mb-6 sm:mb-8 w-full bg-transparent"
              onClick={() => setShowEditProfile(true)}
            >
              Edit profile
            </Button>

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
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={handleDiscardChanges}
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

      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            <DialogDescription>Upload a new profile picture</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profileImage || "/placeholder.svg"} className="object-cover" />
              <AvatarFallback>FS</AvatarFallback>
            </Avatar>
            <Label htmlFor="profile-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-md bg-[#3b82f6] px-4 py-2 text-white hover:bg-[#2563eb] transition-colors">
                <Upload className="h-4 w-4" />
                Upload New Picture
              </div>
              <Input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </Label>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Your recent notifications and alerts</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              {
                title: "Lesson Completed",
                message: "You completed 'Basics - Lesson 1'",
                time: "5 minutes ago",
                type: "success",
              },
              {
                title: "New Achievement",
                message: "You earned 'Perfect Streak (7 Days)' badge",
                time: "2 hours ago",
                type: "achievement",
              },
              {
                title: "Practice Reminder",
                message: "Don't forget your daily practice!",
                time: "1 day ago",
                type: "reminder",
              },
              {
                title: "Friend Request",
                message: "John Doe sent you a friend request",
                time: "2 days ago",
                type: "social",
              },
              {
                title: "System Update",
                message: "New features added to sign detection",
                time: "3 days ago",
                type: "info",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    notification.type === "success"
                      ? "bg-green-500"
                      : notification.type === "achievement"
                        ? "bg-yellow-500"
                        : notification.type === "reminder"
                          ? "bg-blue-500"
                          : notification.type === "social"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <h4 className="font-semibold">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFavourites} onOpenChange={setShowFavourites}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Favourite Lessons</DialogTitle>
            <DialogDescription>Your bookmarked lessons for quick access</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 sm:grid-cols-2">
            {[
              { module: "Basics", lesson: "Hello", progress: 100 },
              { module: "Basics", lesson: "Thank You", progress: 100 },
              { module: "Numbers", lesson: "Number 5", progress: 75 },
              { module: "Phrases", lesson: "How are you?", progress: 50 },
              { module: "Phrases", lesson: "Nice to meet you", progress: 80 },
              { module: "Advanced", lesson: "Complex Conversations", progress: 30 },
            ].map((favourite, index) => (
              <div key={index} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{favourite.lesson}</h4>
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{favourite.module}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#3b82f6] h-2 rounded-full transition-all"
                    style={{ width: `${favourite.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{favourite.progress}% complete</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}
