"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // We wait for user state to be determined (since it loads from localStorage)
    // If not authenticated, redirect to login
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (isAuthenticated && user && allowedRoles) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard if role doesn't match
        router.push(user.role === 'manager' ? '/manager' : '/pantry')
      }
    }
  }, [isAuthenticated, user, allowedRoles, router])

  // Basic "loading" state while checking auth
  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <Loader2 className="w-10 h-10 text-[#065f46] animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
