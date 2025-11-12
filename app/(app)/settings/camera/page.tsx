"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CameraSettingsPage() {
  const [cameraDevice, setCameraDevice] = useState("default")
  const [resolution, setResolution] = useState("720p")
  const [mirrorMode, setMirrorMode] = useState(true)
  const [lowLightMode, setLowLightMode] = useState(false)
  const [handDetection, setHandDetection] = useState(true)

  const handleSave = () => {
    alert("Camera settings saved successfully!")
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
            <h2 className="mb-8 text-2xl font-bold">Camera Settings</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="camera-device" className="text-base font-medium">
                  Camera Device
                </Label>
                <Select value={cameraDevice} onValueChange={setCameraDevice}>
                  <SelectTrigger id="camera-device" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Camera</SelectItem>
                    <SelectItem value="front">Front Camera</SelectItem>
                    <SelectItem value="back">Back Camera</SelectItem>
                    <SelectItem value="external">External Webcam</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Select which camera to use for sign detection</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolution" className="text-base font-medium">
                  Video Resolution
                </Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger id="resolution" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Higher resolution requires more bandwidth</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="mirror-mode" className="text-base font-medium">
                    Mirror Mode
                  </Label>
                  <p className="text-sm text-gray-500">Flip camera view horizontally</p>
                </div>
                <Switch id="mirror-mode" checked={mirrorMode} onCheckedChange={setMirrorMode} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="low-light" className="text-base font-medium">
                    Low Light Enhancement
                  </Label>
                  <p className="text-sm text-gray-500">Improve detection in darker environments</p>
                </div>
                <Switch id="low-light" checked={lowLightMode} onCheckedChange={setLowLightMode} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="hand-detection" className="text-base font-medium">
                    Hand Detection Guides
                  </Label>
                  <p className="text-sm text-gray-500">Show overlay guides for hand positioning</p>
                </div>
                <Switch id="hand-detection" checked={handDetection} onCheckedChange={setHandDetection} />
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
