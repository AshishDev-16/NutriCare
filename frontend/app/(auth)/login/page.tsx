"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { LoginForm } from "@/components/forms/LoginForm"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'manager') {
        router.push('/manager')
      } else if (user.role === 'pantry_staff') {
        router.push('/pantry')
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md space-y-8 px-4 bg-white rounded-xl shadow-lg py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#004532] to-[#065f46] rounded-xl flex items-center justify-center shadow-lg shadow-[#065f46]/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">VF</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-[#004532]">
            Welcome to VitalFlow
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
} 