"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useCallback, useTransition } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    startTransition(() => {
      router.push("/auth/login")
    })
  }, [router])

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
      {isPending ? "Logging out..." : "Log out"}
    </DropdownMenuItem>
  )
}
