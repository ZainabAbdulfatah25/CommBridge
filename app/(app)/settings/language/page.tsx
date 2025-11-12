"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LanguageSettingsPage() {
  const [appLanguage, setAppLanguage] = useState("english")
  const [signLanguage, setSignLanguage] = useState("asl")
  const [voiceLanguage, setVoiceLanguage] = useState("english")

  const handleSave = () => {
    // Save settings logic
    alert("Language settings saved successfully!")
  }

  return (
    <div className="h-full p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/settings" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to Settings
        </Link>

        <Card>
          <CardContent className="p-8">
            <h2 className="mb-8 text-2xl font-bold">Language Settings</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-language" className="text-base font-medium">
                  App Language
                </Label>
                <Select value={appLanguage} onValueChange={setAppLanguage}>
                  <SelectTrigger id="app-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Change the language of the app interface</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sign-language" className="text-base font-medium">
                  Sign Language
                </Label>
                <Select value={signLanguage} onValueChange={setSignLanguage}>
                  <SelectTrigger id="sign-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                    <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                    <SelectItem value="auslan">Australian Sign Language (Auslan)</SelectItem>
                    <SelectItem value="fsl">French Sign Language (LSF)</SelectItem>
                    <SelectItem value="jsl">Japanese Sign Language (JSL)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Select your preferred sign language for learning and detection</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-language" className="text-base font-medium">
                  Voice Recognition Language
                </Label>
                <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
                  <SelectTrigger id="voice-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Language for voice translation feature</p>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button variant="outline" asChild>
                  <Link href="/settings">Cancel</Link>
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
