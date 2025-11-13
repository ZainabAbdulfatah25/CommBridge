"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function About() {
  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-[#3b82f6] text-white p-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">About CommBridge</h1>
        <p className="text-blue-100 mt-2">Breaking communication barriers</p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-3">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            CommBridge is dedicated to making sign language accessible to everyone. We bridge the communication gap
            between deaf and hearing communities through innovative AI-powered translation technology.
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-4">Key Features</h2>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-black mb-1">Voice to Sign Translation</h3>
              <p className="text-gray-600 text-sm">Speak naturally and see real-time sign language interpretation.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-black mb-1">Sign to Text Recognition</h3>
              <p className="text-gray-600 text-sm">
                Use your camera to convert sign language into readable text instantly.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-black mb-1">Interactive Learning</h3>
              <p className="text-gray-600 text-sm">
                Master sign language through practice, lessons, and real-time feedback.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-black mb-1">Multi-Language Support</h3>
              <p className="text-gray-600 text-sm">
                Available in English, Hausa, Pidgin, and Arabic for global accessibility.
              </p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-3">Why CommBridge</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Over 70 million deaf individuals worldwide face communication barriers daily. CommBridge removes these
            obstacles by providing instant, accurate sign language translation powered by cutting-edge artificial
            intelligence.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you're learning sign language, need real-time interpretation, or want to communicate more
            effectively, CommBridge is your companion.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-bold text-black text-lg">Ready to get started?</h3>
          <div className="flex flex-col gap-3">
            <Link href="/auth/sign-up">
              <Button className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-gray-50 font-medium rounded-xl bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
