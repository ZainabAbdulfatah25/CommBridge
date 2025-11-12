import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="h-full p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/settings" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to Settings
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="mb-8 flex items-center gap-4">
              <Image src="/commbridge-logo.png" alt="CommBridge Logo" width={80} height={80} className="h-20 w-20" />
              <div>
                <h2 className="text-2xl font-bold">CommBridge</h2>
                <p className="text-gray-600">Version 1.0.0</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">About CommBridge</h3>
                <p className="text-gray-700 leading-relaxed">
                  CommBridge is a comprehensive sign language learning and translation platform designed to bridge
                  communication gaps between hearing and deaf communities. Our mission is to make sign language
                  accessible to everyone through innovative technology and interactive learning experiences.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Features</h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-700">
                  <li>Real-time sign language detection using AI technology</li>
                  <li>Voice to sign language translation</li>
                  <li>Interactive learning modules for all skill levels</li>
                  <li>Progress tracking and achievements</li>
                  <li>Support for multiple sign languages</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">Contact Us</h3>
                <div className="space-y-1 text-gray-700">
                  <p>Email: support@commbridge.com</p>
                  <p>Website: www.commbridge.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </div>

              <div className="border-t pt-6 text-sm text-gray-600">
                <p>&copy; 2025 CommBridge. All rights reserved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
