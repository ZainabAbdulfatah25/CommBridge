"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative w-[200px] h-[200px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designer__2_-removebg-preview-hPnP21OE6rr1gVvwl4A4j6bxQs88qG.png"
              alt="CommBridge Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-[2.75rem] font-black text-black mb-20 tracking-tight">CommBridge</h1>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full px-2">
          <Link href="/sign-up" prefetch={true}>
            <Button
              size="lg"
              className="w-full h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-base font-medium rounded-xl"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/sign-in" prefetch={true}>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 bg-white border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-gray-50 text-base font-medium rounded-xl"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
