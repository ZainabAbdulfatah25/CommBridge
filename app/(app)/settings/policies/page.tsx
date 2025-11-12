import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PoliciesPage() {
  return (
    <div className="h-full p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/settings" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700">
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to Settings
        </Link>

        <Card>
          <CardContent className="p-8">
            <h2 className="mb-8 text-2xl font-bold">Policies</h2>

            <div className="space-y-8">
              <section>
                <h3 className="mb-4 text-xl font-semibold">Privacy Policy</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Last Updated:</strong> January 2024
                  </p>
                  <p>
                    At CommBridge, we take your privacy seriously. This policy outlines how we collect, use, and protect
                    your personal information.
                  </p>
                  <h4 className="mt-4 font-semibold">Information We Collect</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Account information (name, email, password)</li>
                    <li>Learning progress and activity data</li>
                    <li>Camera and microphone access for sign detection and voice translation</li>
                    <li>Usage statistics and preferences</li>
                  </ul>
                  <h4 className="mt-4 font-semibold">How We Use Your Information</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>To provide and improve our services</li>
                    <li>To personalize your learning experience</li>
                    <li>To track your progress and achievements</li>
                    <li>To send important updates and notifications</li>
                  </ul>
                  <h4 className="mt-4 font-semibold">Data Protection</h4>
                  <p>
                    We use industry-standard encryption and security measures to protect your data. Camera and
                    microphone access is only used when actively using sign detection or voice translation features, and
                    recordings are not stored without your explicit consent.
                  </p>
                </div>
              </section>

              <section className="border-t pt-8">
                <h3 className="mb-4 text-xl font-semibold">Terms of Service</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Last Updated:</strong> January 2024
                  </p>
                  <p>By using CommBridge, you agree to these terms of service.</p>
                  <h4 className="mt-4 font-semibold">User Responsibilities</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Provide accurate account information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the platform respectfully and lawfully</li>
                    <li>Not attempt to reverse engineer or exploit the system</li>
                  </ul>
                  <h4 className="mt-4 font-semibold">Service Availability</h4>
                  <p>
                    We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the
                    right to modify or discontinue features with notice.
                  </p>
                  <h4 className="mt-4 font-semibold">Content Accuracy</h4>
                  <p>
                    While we work to ensure accuracy in our sign language content and translations, AI-based detection
                    and translation may not always be 100% accurate. Use the platform as a learning tool alongside
                    professional instruction when needed.
                  </p>
                </div>
              </section>

              <section className="border-t pt-8">
                <h3 className="mb-4 text-xl font-semibold">Cookie Policy</h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We use cookies and similar technologies to enhance your experience, remember your preferences, and
                    analyze usage patterns. You can control cookie settings through your browser.
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
