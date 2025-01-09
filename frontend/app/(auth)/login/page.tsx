"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const { user, token } = await login(values)
      localStorage.setItem('token', token)
      
      // Redirect based on user role
      if (user.role === 'manager') {
        router.push('/manager')
      } else if (user.role === 'pantry_staff') {
        router.push('/pantry')
      } else {
        router.push('/dashboard')
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-md space-y-8 px-4 bg-white rounded-xl shadow-lg py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-6">
            <span className="text-2xl font-bold text-primary">NutriCare</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to NutriCare
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