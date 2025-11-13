import { requireAuth, getUserProfile } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Crown, Lock } from "lucide-react"
import Link from "next/link"

const premiumFeatures = [
  {
    title: "Advanced Sign Detection",
    description: "Real-time AI-powered hand tracking and gesture recognition",
    icon: "🤖",
  },
  {
    title: "Unlimited Translations",
    description: "No daily limits on voice-to-sign and sign-to-text translations",
    icon: "♾️",
  },
  {
    title: "Progress Analytics",
    description: "Detailed insights, charts, and performance reports",
    icon: "📊",
  },
  {
    title: "Offline Mode",
    description: "Download lessons and practice without internet connection",
    icon: "📴",
  },
  {
    title: "Priority Support",
    description: "Get help faster with dedicated premium support",
    icon: "🎧",
  },
  {
    title: "Ad-Free Experience",
    description: "Enjoy learning without any interruptions",
    icon: "🚫",
  },
]

export default async function PremiumPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  const isPremium = profile?.is_premium || false
  const premiumExpiresAt = profile?.premium_expires_at ? new Date(profile.premium_expires_at) : null

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b bg-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Premium Membership</h1>
            <p className="text-gray-600 mt-1">Unlock all features and accelerate your learning</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {isPremium ? (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <Crown className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Premium Active</h2>
                  <p className="text-gray-600">
                    {premiumExpiresAt
                      ? `Your premium membership expires on ${premiumExpiresAt.toLocaleDateString()}`
                      : "You have lifetime premium access"}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/settings">Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center">
                <Crown className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
                <p className="text-gray-600 mb-6">Get unlimited access to all features</p>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12">
                  Start Free Trial
                </Button>
                <p className="text-sm text-gray-500 mt-3">7-day free trial, cancel anytime</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Premium Features</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className={isPremium ? "border-green-200" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    {isPremium ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Compare Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-4">Feature</th>
                    <th className="py-4 px-4 text-center">Free</th>
                    <th className="py-4 px-4 text-center bg-blue-50">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">Basic Sign Detection</td>
                    <td className="py-4 px-4 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Learning Modules</td>
                    <td className="py-4 px-4 text-center">4 modules</td>
                    <td className="py-4 px-4 text-center bg-blue-50">All modules</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Daily Translations</td>
                    <td className="py-4 px-4 text-center">10/day</td>
                    <td className="py-4 px-4 text-center bg-blue-50">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Advanced AI Detection</td>
                    <td className="py-4 px-4 text-center">-</td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">Progress Analytics</td>
                    <td className="py-4 px-4 text-center">Basic</td>
                    <td className="py-4 px-4 text-center bg-blue-50">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">Offline Mode</td>
                    <td className="py-4 px-4 text-center">-</td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
