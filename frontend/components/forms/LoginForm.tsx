"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()
      console.log('Login response:', data)

      if (data.success) {
        // Use the auth hook to set state and localStorage
        authLogin({
          ...data.user,
          token: data.token
        })
        
        toast({
          title: "Access Granted",
          description: `Welcome to VitalFlow, ${data.user.name}`,
        })

        // Redirect based on role
        const path = data.user.role === 'manager' 
          ? '/manager' 
          : '/pantry'
            
        router.push(path)
      } else {
        throw new Error(data.message || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to connect to clinical server",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700">Clinical ID (Email)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Enter your clinical email"
                    className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-bold text-slate-700">Security Key</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-slate-50 border-none rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-11 bg-[#065f46] hover:bg-[#064e3b] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Authenticate Access"
          )}
        </Button>
      </form>
    </Form>
  )
}
