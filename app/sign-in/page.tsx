"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useState, useTransition, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  const { isAuthenticated, login } = useUser()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    const success = login(email, password)

    if (success) {
      startTransition(() => {
        router.push("/dashboard")
      })
    } else {
      setErrorMessage("Invalid email or password. Please try again or sign up.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 lg:p-12 bg-gray-50">
        <div className="relative w-full max-w-md aspect-square">
          <Image
            src="/sign-language-illustration.jpg"
            alt="Sign language illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8">Welcome Back!!!</h1>
          </div>

          {/* Social Sign In */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <Button
              variant="outline"
              className="flex-1 h-11 sm:h-12 border-gray-300 bg-transparent text-sm sm:text-base"
            >
              Sign In with Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11 sm:h-12 border-gray-300 bg-transparent text-sm sm:text-base"
            >
              Sign In with Facebook
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-5 sm:space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-normal text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-11 sm:h-12"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-normal text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 sm:h-12 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-red-500 hover:text-red-600">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-base"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/sign-up" className="text-[#3b82f6] hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
