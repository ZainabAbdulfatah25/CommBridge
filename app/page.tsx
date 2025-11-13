"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-4">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="mb-4">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src="/images/designer-2-removebg-preview.png"
              alt="CommBridge Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <h1 className="text-3xl font-black text-black mb-6 tracking-tight">CommBridge</h1>

        <div className="flex flex-col gap-3 w-full px-2">
          <Link href="/auth/sign-up" prefetch={true}>
            <Button
              size="lg"
              className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-base font-medium rounded-xl"
            >
              Get Started
            </Button>
          </Link>

          <Link href="/auth/login" prefetch={true}>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-11 bg-white border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-gray-50 text-base font-medium rounded-xl"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
